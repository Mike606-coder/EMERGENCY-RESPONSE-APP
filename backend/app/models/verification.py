"""Verification models."""
from datetime import datetime, timedelta
from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.models.base import Base


class VerificationOTP(Base):
    """OTP verification model."""
    __tablename__ = "verification_otps"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Contact Info
    contact = Column(String(255), nullable=False)  # email or phone
    contact_type = Column(String(20), nullable=False)  # email, phone
    
    # OTP
    otp_code = Column(String(10), nullable=False)
    is_used = Column(Boolean, default=False)
    
    # Attempts
    attempt_count = Column(Integer, default=0)
    max_attempts = Column(Integer, default=5)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    verified_at = Column(DateTime, nullable=True)
