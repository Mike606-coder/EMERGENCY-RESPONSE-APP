"""Security utilities for authentication and encryption."""
import logging
from datetime import datetime, timedelta
from typing import Optional, Any
import os

import jwt
import bcrypt
from cryptography.fernet import Fernet
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import base64

from app.core.config import settings

logger = logging.getLogger(__name__)


class PasswordHasher:
    """Password hashing utilities."""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt."""
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode(), salt).decode()
    
    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """Verify password against hash."""
        return bcrypt.checkpw(password.encode(), hashed_password.encode())


class JWTHandler:
    """JWT token handling."""
    
    @staticmethod
    def create_access_token(
        subject: str,
        expires_delta: Optional[timedelta] = None,
        **kwargs
    ) -> str:
        """Create JWT access token."""
        if expires_delta is None:
            expires_delta = timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        expire = datetime.utcnow() + expires_delta
        payload = {
            "sub": subject,
            "exp": expire,
            "iat": datetime.utcnow(),
            **kwargs
        }
        
        encoded_jwt = jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(subject: str) -> str:
        """Create JWT refresh token."""
        expires_delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        return JWTHandler.create_access_token(
            subject=subject,
            expires_delta=expires_delta,
            token_type="refresh"
        )
    
    @staticmethod
    def decode_token(token: str) -> Optional[dict]:
        """Decode and verify JWT token."""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return None
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return None


class EncryptionHandler:
    """AES-256 encryption utilities for sensitive data."""
    
    @staticmethod
    def _get_key() -> bytes:
        """Get or create encryption key."""
        key_str = settings.ENCRYPTION_KEY
        if len(key_str) < 32:
            # Pad key to 32 bytes if needed
            key_str = key_str.ljust(32, '0')
        return key_str[:32].encode()
    
    @staticmethod
    def encrypt(data: str) -> str:
        """Encrypt data using AES-256-CBC."""
        try:
            key = EncryptionHandler._get_key()
            cipher = AES.new(key, AES.MODE_CBC)
            ct_bytes = cipher.encrypt(pad(data.encode(), AES.block_size))
            iv = base64.b64encode(cipher.iv).decode()
            ct = base64.b64encode(ct_bytes).decode()
            return f"{iv}:{ct}"
        except Exception as e:
            logger.error(f"Encryption error: {str(e)}")
            raise
    
    @staticmethod
    def decrypt(encrypted_data: str) -> str:
        """Decrypt data using AES-256-CBC."""
        try:
            key = EncryptionHandler._get_key()
            iv, ct = encrypted_data.split(":")
            iv = base64.b64decode(iv)
            ct = base64.b64decode(ct)
            cipher = AES.new(key, AES.MODE_CBC, iv)
            pt = unpad(cipher.decrypt(ct), AES.block_size)
            return pt.decode()
        except Exception as e:
            logger.error(f"Decryption error: {str(e)}")
            raise


class OTPGenerator:
    """OTP generation and validation."""
    
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        """Generate random OTP."""
        import random
        import string
        return ''.join(random.choices(string.digits, k=length))
    
    @staticmethod
    def verify_otp(otp: str, stored_otp: str, expiry_time: datetime) -> bool:
        """Verify OTP and check if expired."""
        if datetime.utcnow() > expiry_time:
            return False
        return otp == stored_otp
