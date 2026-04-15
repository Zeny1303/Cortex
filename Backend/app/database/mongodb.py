import logging
from typing import Optional

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config.settings import settings

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

db_config = Database()

async def connect_to_mongo():
    """
    Initialize the Mongo client and verify connectivity.

    Motor connects lazily; without an explicit ping, the app can report "startup complete"
    while the first real query later fails with a long server-selection timeout.
    """
    logger.info("Connecting to MongoDB...")
    try:
        db_config.client = AsyncIOMotorClient(
            settings.MONGO_URI,
            maxPoolSize=settings.MAX_CONNECTIONS_COUNT,
            minPoolSize=settings.MIN_CONNECTIONS_COUNT,
            serverSelectionTimeoutMS=3000,
            connectTimeoutMS=3000,
        )
        db_config.db = db_config.client["interview_db"]

        # Force an actual connection attempt now.
        await db_config.client.admin.command("ping")
        logger.info("Connected to MongoDB successfully.")
    except Exception as e:
        # Keep the process alive (useful for local dev), but mark DB as unavailable.
        logger.error(f"MongoDB connection failed: {e}", exc_info=True)
        db_config.db = None

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db_config.client:
        db_config.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    """Dependency to get the database instance"""
    if db_config.db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable. Ensure MongoDB is running and MONGO_URI is correct.",
        )
    return db_config.db
