import logging
from fastapi import HTTPException, status
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_access_token

logger = logging.getLogger(__name__)

async def signup_user(user_data, db):
    users_collection = db["users"]
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        logger.warning(f"Signup failed: User with email {user_data.email} already exists.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="User with this email already exists"
        )
    
    hashed_password = hash_password(user_data.password)
    
    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "skills": user_data.skills,
        "password": hashed_password
    }
    
    result = await users_collection.insert_one(new_user)
    
    logger.info(f"User {user_data.email} successfully signed up.")
    return {"message": "User registered successfully"}


async def login_user(user_data, db):
    users_collection = db["users"]
    db_user = await users_collection.find_one({"email": user_data.email})
    if not db_user:
        logger.warning(f"Login failed: Email {user_data.email} not found.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )

    if not verify_password(user_data.password, db_user["password"]):
        logger.warning(f"Login failed: Incorrect password for {user_data.email}.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )

    token = create_access_token(data={"user_id": str(db_user["_id"]), "email": db_user["email"]})
    
    logger.info(f"User {user_data.email} successfully logged in.")
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"],
            "skills": db_user["skills"]
        }
    }


async def logout():
    return {"message": "Logout successful"}