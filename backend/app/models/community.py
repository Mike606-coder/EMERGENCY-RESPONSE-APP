"""Community engagement models."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID, JSON, ARRAY
import enum
import uuid

from app.models.base import Base


class PostType(str, enum.Enum):
    """Community post type."""
    HELP_REQUEST = "help_request"
    ALERT = "alert"
    TIP = "tip"
    NEWS = "news"
    SUCCESS_STORY = "success_story"


class PostStatus(str, enum.Enum):
    """Post status."""
    ACTIVE = "active"
    RESOLVED = "resolved"
    ARCHIVED = "archived"
    DELETED = "deleted"


class Post(Base):
    """Community post model."""
    __tablename__ = "community_posts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Content
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    post_type = Column(String(50), default=PostType.HELP_REQUEST.value)
    status = Column(String(20), default=PostStatus.ACTIVE.value)
    
    # Location
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_address = Column(String(500), nullable=True)
    
    # Metadata
    tags = Column(ARRAY(String), default=[])
    category = Column(String(100), nullable=True)
    priority = Column(Integer, default=1)  # 1-5
    
    # Media
    media_paths = Column(JSON, default=[])
    
    # Engagement
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    help_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    
    # Resolution
    resolved_by_user_id = Column(UUID(as_uuid=True), nullable=True)
    resolution_note = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)


class Comment(Base):
    """Community comment model."""
    __tablename__ = "community_comments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Content
    content = Column(Text, nullable=False)
    
    # Metadata
    like_count = Column(Integer, default=0)
    helpful_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    edited_at = Column(DateTime, nullable=True)


class Like(Base):
    """Like model for posts and comments."""
    __tablename__ = "likes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Liked Item
    post_id = Column(UUID(as_uuid=True), ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=True)
    comment_id = Column(UUID(as_uuid=True), ForeignKey("community_comments.id", ondelete="CASCADE"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
