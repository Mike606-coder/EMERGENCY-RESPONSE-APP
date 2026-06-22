"""User model."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID, JSON
import enum
import uuid

from app.models.base import Base


class VerificationStatus(str, enum.Enum):
    """User verification status."""
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class UserRole(str, enum.Enum):
    """User role."""
    USER = "user"
    RESPONDER = "responder"
    ADMIN = "admin"


class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    full_name = Column(String(255), nullable=False)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # Verification
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    verification_status = Column(String(20), default=VerificationStatus.PENDING.value)
    
    # Identity Info (Encrypted)
    national_id = Column(String(255), nullable=True)  # Encrypted
    passport_number = Column(String(255), nullable=True)  # Encrypted
    id_country = Column(String(100), nullable=True)
    
    # Media
    id_image_path = Column(String(500), nullable=True)
    selfie_path = Column(String(500), nullable=True)
    profile_picture_path = Column(String(500), nullable=True)
    
    # Role & Permissions
    role = Column(String(20), default=UserRole.USER.value)
    is_active = Column(Boolean, default=True)
    is_responder = Column(Boolean, default=False)
    responder_type = Column(String(50), nullable=True)  # medical, police, fire, etc.
    
    # Stats
    reputation_score = Column(Integer, default=0)
    help_count = Column(Integer, default=0)
    emergency_reports_count = Column(Integer, default=0)
    
    # Metadata
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<User {self.username}>"
