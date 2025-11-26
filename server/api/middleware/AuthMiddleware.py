# app/auth/middleware.py
import jwt
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from api.auth.service import AuthService
from jwt import ExpiredSignatureError
from core.database import SessionLocal
from utils.logger import logger
from core.constants import ACCESS_TOKEN_SECRET


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS" or request.url.path in [
            "/api/auth/login",
            "/api/auth/register",
        ]:
            # logger.debug(f"Skipping auth for path: {request.url.path}")
            return await call_next(request)

        access_token = request.cookies.get("access_token")
        guest_id = request.headers.get("X-Guest-Id")

        # If no access token, check for guest ID
        if not access_token:
            # Only allow guest access on /api/chat/* routes
            if guest_id and request.url.path.startswith("/api/chat"):
                # Allow guest access
                request.state.user = {
                    "userId": guest_id,
                    "is_guest": True,
                }
                return await call_next(request)
            else:
                # logger.debug("No access token or guest ID found, or not a chat route.")
                return JSONResponse({"detail": "Unauthorized"}, status_code=401)

        db = SessionLocal()
        auth_service = AuthService(db)

        try:
            # Normal validation
            user_info = auth_service.verify_access_token(access_token)
            # logger.info(f"Access token valid for user: {user_info.get('userId')}")
            user_info["is_guest"] = False
            request.state.user = user_info
            return await call_next(request)

        except ExpiredSignatureError:
            # logger.info("Access token expired. Attempting refresh...")

            try:
                payload = jwt.decode(
                    access_token,
                    ACCESS_TOKEN_SECRET,
                    algorithms=["HS256"],
                    options={"verify_exp": False},  # ignore expiration
                )
                user_id = payload.get("userId")
                # logger.debug(f"Decoded expired token for userId: {user_id}")
            except Exception as e:
                logger.error(f"Failed to decode expired token: {e}")
                return JSONResponse({"detail": "Unauthorized"}, status_code=401)

            session = auth_service.fetch_user_session(user_id)
            if not session:
                logger.warning(f"No session found for userId: {user_id}")
                return JSONResponse({"detail": "Unauthorized"}, status_code=401)

            refreshed_session = auth_service.verify_refresh_token(session.refresh_token)
            if not refreshed_session:
                logger.warning(f"Invalid refresh token for userId: {user_id}")
                return JSONResponse({"detail": "Unauthorized"}, status_code=401)

            # Issue new short-lived access token
            new_access_token = auth_service.create_access_token(refreshed_session.user)
            # logger.info(f"Issued new access token for userId: {user_id}")

            request.state.user = {
                "userId": str(refreshed_session.user.id),
                "username": refreshed_session.user.username,
                "email": refreshed_session.user.email,
                "is_guest": False,
            }

            response = await call_next(request)
            response.set_cookie(
                "access_token",
                new_access_token,
                httponly=True,
                max_age=60 * 60 * 24 * 30,  # cookie valid for 30 days
                secure=True,
                samesite="none",
            )
            # logger.debug("Updated access_token cookie in response.")
            return response

        except Exception as e:
            # logger.debug(f"Unexpected error in AuthMiddleware: {e}")
            return JSONResponse({"detail": "Unauthorized"}, status_code=401)

        finally:
            db.close()
