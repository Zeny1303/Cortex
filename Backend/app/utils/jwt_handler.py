import logging
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from app.config.settings import settings

logger = logging.getLogger(__name__)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    
    # Require user_id and email in the data payload
    if "user_id" not in to_encode or "email" not in to_encode:
        logger.error("Missing required JWT fields (user_id, email).")
        raise ValueError("JWT payload must include 'user_id' and 'email'")
        
    # Use standard application configuration for days expiration
    expire = datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DAYS)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except ExpiredSignatureError:
        logger.warning("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        logger.warning("Invalid token presented")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )