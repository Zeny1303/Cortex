import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_config = Database()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    db_config.client = AsyncIOMotorClient(
        settings.MONGO_URI,
        maxPoolSize=settings.MAX_CONNECTIONS_COUNT,
        minPoolSize=settings.MIN_CONNECTIONS_COUNT
    )
    db_config.db = db_config.client["prep"]
    logger.info("Connected to MongoDB successfully.")

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db_config.client:
        db_config.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    """Dependency to get the database instance"""
    return db_config.db
