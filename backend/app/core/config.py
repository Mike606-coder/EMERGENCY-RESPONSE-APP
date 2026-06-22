"""Application configuration."""
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/emergency_app"
    DATABASE_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8081",
        "http://localhost:19000",
    ]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@emergencyapp.com"
    EMAIL_FROM_NAME: str = "Emergency Response App"
    
    # SMS
    SMS_API_PROVIDER: str = "africas_talking"
    SMS_API_KEY: str = ""
    SMS_API_USERNAME: str = ""
    SMS_SENDER_ID: str = "EMERGENCY"
    
    # Maps
    GOOGLE_MAPS_API_KEY: str = ""
    
    # Emergency Contacts
    EMERGENCY_POLICE: str = "911"
    EMERGENCY_MEDICAL: str = "911"
    EMERGENCY_FIRE: str = "911"
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "pdf", "mp3", "m4a"]
    UPLOAD_DIR: str = "./uploads"
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60
    
    # Location Tracking
    LOCATION_UPDATE_INTERVAL_SECONDS: int = 10
    LOCATION_HISTORY_RETENTION_DAYS: int = 7
    
    # Encryption
    ENCRYPTION_KEY: str = "your-32-byte-encryption-key-for-aes-256"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
