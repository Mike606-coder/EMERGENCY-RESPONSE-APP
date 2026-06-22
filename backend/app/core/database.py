"""Database connection and initialization."""
import logging
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
)
from sqlalchemy.pool import NullPool

from app.core.config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy engine and session maker
engine = None
AsyncSessionLocal = None


async def init_db() -> None:
    """Initialize database connection."""
    global engine, AsyncSessionLocal
    
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DATABASE_ECHO,
        future=True,
        pool_pre_ping=True,
        poolclass=NullPool if settings.ENVIRONMENT == "development" else None,
    )
    
    AsyncSessionLocal = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )
    
    # Create all tables
    async with engine.begin() as conn:
        # Import all models to register them
        from app.models.user import User
        from app.models.chat import Chat, ChatMember, Message
        from app.models.emergency import Emergency, EmergencyContact
        from app.models.location import LocationHistory
        from app.models.community import Post, Comment, Like
        from app.models.verification import VerificationOTP
        
        # Create tables
        # Note: In production, use Alembic migrations
        # await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """Close database connection."""
    global engine
    if engine:
        await engine.dispose()


async def get_db() -> AsyncSession:
    """Get database session."""
    async with AsyncSessionLocal() as session:
        yield session
