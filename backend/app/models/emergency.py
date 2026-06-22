"""Emergency-related models."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Text, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID, JSON, POINT
import enum
import uuid

from app.models.base import Base


class EmergencyType(str, enum.Enum):
    """Emergency type."""
    MEDICAL = "medical"
    CRIME = "crime"
    FIRE = "fire"
    ACCIDENT = "accident"
    NATURAL_DISASTER = "natural_disaster"
    OTHER = "other"


class EmergencyStatus(str, enum.Enum):
    """Emergency alert status."""
    ACTIVE = "active"
    RESOLVED = "resolved"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class Emergency(Base):
    """Emergency alert model."""
    __tablename__ = "emergencies"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # User Info
    user_id = Column(UUID(as_uuid=True), nullable=False)
    user_name = Column(String(255), nullable=False)  # Encrypted user info
    user_phone = Column(String(20), nullable=True)  # Encrypted
    user_verified = Column(Boolean, default=False)
    
    # Emergency Details
    emergency_type = Column(String(50), nullable=False)
    status = Column(String(20), default=EmergencyStatus.ACTIVE.value)
    description = Column(Text, nullable=True)
    severity = Column(Integer, default=1)  # 1-5
    
    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_address = Column(String(500), nullable=True)
    location_accuracy = Column(Float, nullable=True)  # meters
    
    # Responders
    responder_ids = Column(JSON, default=[])  # List of assigned responder IDs
    responder_count = Column(Integer, default=0)
    
    # Engagement
    help_offers = Column(Integer, default=0)
    reactions = Column(JSON, default={})  # emoji reactions
    
    # Media
    media_paths = Column(JSON, default=[])  # Array of file paths
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)


class EmergencyContact(Base):
    """Emergency contact numbers."""
    __tablename__ = "emergency_contacts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Contact Info
    service_type = Column(String(50), nullable=False)  # police, medical, fire, etc.
    service_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=False)
    
    # Location
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    response_time = Column(Integer, nullable=True)  # minutes
    
    # Additional Info
    website = Column(String(500), nullable=True)
    email = Column(String(255), nullable=True)
    metadata = Column(JSON, default={})
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
