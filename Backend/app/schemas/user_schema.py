from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import List, Optional, Generic, TypeVar
from datetime import datetime
from app.models.user_model import UserModel
import re

T = TypeVar('T')

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    skills: List[str] = []

    @field_validator("email")
    def validate_gmail(cls, v: str) -> str:
        if not v.lower().endswith("@gmail.com"):
            raise ValueError("Only @gmail.com addresses are allowed.")
        return v

    @field_validator("password")
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must contain uppercase, lowercase, and special character")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain uppercase, lowercase, and special character")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain uppercase, lowercase, and special character")
        if not re.search(r'\W', v):
            raise ValueError("Password must contain uppercase, lowercase, and special character")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    skills: List[str]
    created_at: datetime
    is_verified: bool
    total_score: int

class UserInDB(UserModel):
    id: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str