# app/auth/router.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from core.database import get_orm_session
from .service import AuthService
from .dto.dto import RegisterRequest, LoginRequest
from datetime import datetime, timezone

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service(db: Session = Depends(get_orm_session)) -> AuthService:
    return AuthService(db)


@auth_router.post("/register", response_model=dict)
def register(
    data: RegisterRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service)
):
    user, token_info = service.register_user(
        username=data.username,
        email=data.email,
        password=data.password,
        response=response
    )
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "token": token_info
    }


@auth_router.post("/login", response_model=dict)
def login(
    data: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service)
):
    user, token_info = service.authenticate_user(
        email=data.email,
        password=data.password,
        response=response
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    return {
        "message": "Login successful",
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "token": token_info
    }


@auth_router.post("/logout", response_model=dict)
def logout(
    request: Request,
    response: Response,
    service: AuthService = Depends(get_auth_service)
):
    # Get user from request state (set by middleware)
    user_info = getattr(request.state, "user", None)
    
    if user_info and not user_info.get("is_guest"):
        user_id = user_info.get("userId")
        service.invalidate_user_sessions(user_id)
    
    # Clear cookies
    response.delete_cookie("access_token")
    
    return {"message": "Logout successful"}