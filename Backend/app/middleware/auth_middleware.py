from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from bson import ObjectId          # ← ADD THIS
import os
from app.database import users_collection
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # ✅ FIX: Cast string ID back to ObjectId for MongoDB lookup
    try:
        object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Malformed user ID in token")

    user = await users_collection.find_one({"_id": object_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # ✅ Attach serialized id so controllers can use current_user["id"]
    user["id"] = str(user["_id"])
    return user