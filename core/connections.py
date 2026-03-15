# ===== File: core/connections.py =====
import redis
from pymongo import MongoClient
from core.logger import logger

# Redis for Caching (Port 6380)
try:
    redis_client = redis.Redis(host='localhost', port=6380, db=0, decode_responses=True)
    redis_client.ping()
    logger.info("Redis connected successfully.")
except Exception as e:
    logger.error(f"Redis connection failed: {e}")
    redis_client = None

# MongoDB for Chat History (Port 27018)
try:
    mongo_client = MongoClient("mongodb://localhost:27018/", serverSelectionTimeoutMS=2000)
    db = mongo_client["ai_cortex"]
    chat_col = db["chat_history"]
    logger.info("MongoDB connected successfully.")
except Exception as e:
    logger.error(f"MongoDB connection failed: {e}")
    chat_col = None