"""Authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, validator
from typing import Optional

router = APIRouter()


class RegisterRequest(BaseModel):
    """User registration request."""
    full_name: str
    username: str
    email: EmailStr
    phone: str
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v


class LoginRequest(BaseModel):
    """User login request."""
    email_or_phone: str
    password: str


class TokenResponse(BaseModel):
    """Token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    """Register a new user."""
    return {
        "message": "Registration initiated. Please verify your email and phone.",
        "user_id": "temp-user-id"
    }


@router.post("/login")
async def login(request: LoginRequest):
    """Login user."""
    return TokenResponse(
        access_token="temp-token",
        refresh_token="temp-refresh-token",
        expires_in=1800
    )


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token."""
    return TokenResponse(
        access_token="new-temp-token",
        refresh_token="new-temp-refresh-token",
        expires_in=1800
    )


@router.post("/logout")
async def logout():
    """Logout user."""
    return {"message": "Successfully logged out"}
