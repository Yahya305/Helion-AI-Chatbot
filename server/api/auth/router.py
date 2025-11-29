# app/auth/router.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from core.database import get_orm_session
from .service import AuthService
from .dto.dto import LoginRequest, RegisterRequest

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service(db: Session = Depends(get_orm_session)) -> AuthService:
    return AuthService(db)


# ========= Endpoints ==========

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
        "id": str(user.id),
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
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
        "token": token_info
    }


@auth_router.post("/logout")
def logout(
    request: Request,
    response: Response,
    service: AuthService = Depends(get_auth_service)
):
    # Get user from request state (set by middleware)
    if hasattr(request.state, 'user') and request.state.user:
        user_id = request.state.user.get('userId')
        if user_id:
            service.invalidate_user_sessions(user_id)
    
    # Clear the access_token cookie
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="none",
        secure=True
    )
    return {"message": "Logged out successfully"}


@auth_router.get("/me")
def get_current_user(request: Request):
    """Get the current authenticated user or guest info"""
    
    user_info = request.state.user
    return {
        "userId": user_info.get('userId'),
        "username": user_info.get('username'),
        "email": user_info.get('email'),
        "isGuest": user_info.get('isGuest', False)
    }