import logging
from bson import ObjectId
from fastapi import HTTPException, status
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.models.user_model import UserModel

logger = logging.getLogger(__name__)

async def create_user(name: str, email: str, password: str, db):
    users_collection = db["users"]
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        logger.warning(f"Signup failed: User with email {email} already exists.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    hashed_password = hash_password(password)
    
    new_user = UserModel(
        name=name,
        email=email,
        password_hash=hashed_password,
        skills=[]
    )
    
    user_dict = new_user.model_dump(by_alias=True)
    await users_collection.insert_one(user_dict)
    
    logger.info(f"User {email} successfully signed up.")
    return {"message": "User registered successfully"}

async def authenticate_user(email: str, password: str, db):
    users_collection = db["users"]
    db_user = await users_collection.find_one({"email": email})
    if not db_user:
        logger.warning(f"Login failed: Email {email} not found.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )

    db_password = db_user.get("password_hash") or db_user.get("password") or db_user.get("hashed_password")
    if not db_password or not verify_password(password, db_password):
        logger.warning(f"Login failed: Incorrect password for {email}.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )

    token = create_access_token(data={"user_id": str(db_user["_id"]), "email": db_user["email"]})
    
    logger.info(f"User {email} successfully logged in.")
    return {
        "access_token": token, 
        "token_type": "bearer"
    }

async def get_user_by_id(user_id: str, db):
    try:
        object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format")

    users_collection = db["users"]
    user = await users_collection.find_one({"_id": object_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user["id"] = str(user["_id"])
    
    # Remove sensitive fields before returning
    user.pop("password", None)
    user.pop("hashed_password", None)
    user.pop("password_hash", None)
    user.pop("_id", None)
    
    return user
