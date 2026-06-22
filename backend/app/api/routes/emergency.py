"""Emergency endpoints."""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class EmergencyAlertRequest(BaseModel):
    """Emergency alert request."""
    emergency_type: str
    latitude: float
    longitude: float
    description: Optional[str] = None


class NearbyServiceRequest(BaseModel):
    """Nearby service request."""
    latitude: float
    longitude: float
    service_type: str
    radius_km: float = 5.0


@router.post("/alert")
async def trigger_emergency_alert(request: EmergencyAlertRequest):
    """Trigger emergency alert."""
    return {
        "alert_id": "temp-alert-id",
        "status": "active",
        "message": "Emergency alert sent to nearby responders"
    }


@router.get("/alerts")
async def get_nearby_alerts(latitude: float, longitude: float, radius_km: float = 5.0):
    """Get nearby emergency alerts."""
    return {
        "alerts": [],
        "count": 0,
        "location": {"latitude": latitude, "longitude": longitude}
    }


@router.get("/services")
async def get_nearby_services(latitude: float, longitude: float, service_type: str, radius_km: float = 5.0):
    """Get nearby emergency services."""
    return {
        "services": [],
        "count": 0,
        "service_type": service_type,
        "location": {"latitude": latitude, "longitude": longitude}
    }
