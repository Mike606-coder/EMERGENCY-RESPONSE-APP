"""Chat and messaging models."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSON
import enum
import uuid

from app.models.base import Base


class MessageType(str, enum.Enum):
    """Message type."""
    TEXT = "text"
    VOICE = "voice"
    IMAGE = "image"
    VIDEO = "video"
    FILE = "file"
    LOCATION = "location"
    ALERT = "alert"


class Chat(Base):
    """Chat model for one-to-one and group chats."""
    __tablename__ = "chats"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=True)  # Null for one-to-one, set for groups
    chat_type = Column(String(20), default="direct")  # direct, group
    
    # Group Info
    description = Column(Text, nullable=True)
    group_picture_path = Column(String(500), nullable=True)
    is_emergency_group = Column(Boolean, default=False)
    
    # Admin
    admin_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Encryption
    is_encrypted = Column(Boolean, default=True)
    encryption_key = Column(String(255), nullable=True)  # Encrypted
    
    # Stats
    member_count = Column(Integer, default=0)
    message_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_message_at = Column(DateTime, nullable=True)


class ChatMember(Base):
    """Chat member model."""
    __tablename__ = "chat_members"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Role
    role = Column(String(20), default="member")  # admin, member, muted
    
    # Notification Settings
    notifications_enabled = Column(Boolean, default=True)
    muted = Column(Boolean, default=False)
    
    # Read Status
    last_read_message_id = Column(UUID(as_uuid=True), nullable=True)
    last_read_at = Column(DateTime, nullable=True)
    
    # Timestamps
    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    left_at = Column(DateTime, nullable=True)


class Message(Base):
    """Message model."""
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Content (Encrypted)
    content = Column(Text, nullable=False)  # Encrypted message
    message_type = Column(String(20), default=MessageType.TEXT.value)
    media_path = Column(String(500), nullable=True)  # For media files
    media_url = Column(String(500), nullable=True)
    
    # Metadata
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    
    # Read Receipts
    read_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    
    # Reactions
    reactions = Column(JSON, default={})  # {emoji: [user_ids]}
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class TypingIndicator(Base):
    """Typing indicator model."""
    __tablename__ = "typing_indicators"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
