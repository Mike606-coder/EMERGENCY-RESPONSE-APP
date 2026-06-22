"""External services integration endpoints."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/news")
async def get_news_feed():
    """Get news and alerts feed."""
    return {
        "news": [],
        "alerts": [],
        "count": 0
    }


@router.get("/weather")
async def get_weather(latitude: float, longitude: float):
    """Get weather data."""
    return {
        "latitude": latitude,
        "longitude": longitude,
        "temperature": 0,
        "conditions": "unknown"
    }
