from fastapi import APIRouter, Depends
from app.schemas.user_schema import UserCreate, UserLogin, TokenResponse
from app.services import auth_service
from app.middleware.auth_middleware import get_current_user
from app.database.mongodb import get_database

router = APIRouter()

@router.post("/signup", status_code=201)
async def signup(user: UserCreate, db = Depends(get_database)):
    return await auth_service.create_user(
        name=user.name, 
        email=user.email, 
        password=user.password, 
        db=db
    )

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin, db = Depends(get_database)):
    return await auth_service.authenticate_user(
        email=user.email, 
        password=user.password, 
        db=db
    )

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    user_id = current_user.get("id")
    # Use the service layer function as requested
    user = await auth_service.get_user_by_id(user_id, db)
    return {"user": user}

@router.post("/logout")
async def logout():
    return {"message": "Logout successful"}