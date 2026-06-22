"""Location tracking models."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID, JSON
import uuid

from app.models.base import Base


class LocationHistory(Base):
    """User location history."""
    __tablename__ = "location_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)  # meters
    heading = Column(Float, nullable=True)  # degrees
    speed = Column(Float, nullable=True)  # m/s
    
    # Address
    address = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    
    # Context
    device_type = Column(String(50), nullable=True)  # ios, android
    is_emergency = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    recorded_at = Column(DateTime, nullable=False)  # Client time


class LocationPreference(Base):
    """User location sharing preferences."""
    __tablename__ = "location_preferences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, unique=True)
    
    # Sharing Settings
    share_live_location = Column(Boolean, default=True)
    share_with_responders = Column(Boolean, default=True)
    share_with_contacts = Column(Boolean, default=True)
    
    # Accuracy
    location_accuracy = Column(String(20), default="precise")  # precise, approximate, city
    
    # Update Frequency
    update_interval_seconds = Column(Integer, default=10)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
