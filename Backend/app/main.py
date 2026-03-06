from fastapi import FastAPI
#from app.routers import auth_router, slot_router, user_router

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Mock Interview Platform Backend Running 🚀"}
'''
app.include_router(auth_router.router, prefix="/api/auth")
app.include_router(slot_router.router, prefix="/api/slots")
app.include_router(user_router.router, prefix="/api/user")'''
from app.database import db

@app.get("/db-test")
async def db_test():
    collections = await db.list_collection_names()
    return {"collections": collections}

@app.on_event("startup")
async def startup_db():
    print("MongoDB connected")    