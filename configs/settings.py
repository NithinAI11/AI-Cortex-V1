from pydantic import BaseSettings

class Settings(BaseSettings):
    project_name: str = "AI Cortex"
    vector_db: str = "qdrant"

settings = Settings()
