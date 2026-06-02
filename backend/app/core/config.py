from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "CoalLab AI"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "a-very-secret-key-for-development-only-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "coallab"
    POSTGRES_PORT: str = "5432"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.POSTGRES_SERVER.startswith("sqlite"):
            return self.POSTGRES_SERVER
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis/Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI/ML
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    model_config = ConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
