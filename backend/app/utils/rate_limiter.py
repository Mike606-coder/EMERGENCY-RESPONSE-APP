"""Rate limiting utility."""
import asyncio
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, Tuple


class RateLimiter:
    """Simple rate limiter implementation."""
    
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = defaultdict(list)
    
    async def check_rate_limit(self, key: str) -> Tuple[bool, int]:
        """Check if request is within rate limit.
        
        Returns:
            Tuple[bool, int]: (is_allowed, remaining_requests)
        """
        now = datetime.utcnow()
        minute_ago = now - timedelta(minutes=1)
        
        # Remove old requests
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if req_time > minute_ago
        ]
        
        # Check if limit exceeded
        if len(self.requests[key]) >= self.requests_per_minute:
            return False, 0
        
        # Add current request
        self.requests[key].append(now)
        remaining = self.requests_per_minute - len(self.requests[key])
        return True, remaining
