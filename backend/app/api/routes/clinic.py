from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.services.clinic_service import get_clinic

router = APIRouter()


@router.get("/api/clinic")
async def get_clinic_info(session: AsyncSession = Depends(get_db)) -> dict:
    clinic = await get_clinic(session)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic info not configured yet.")
    return {
        "name": clinic.name,
        "address": clinic.address,
        "phone": clinic.phone,
        "email": clinic.email,
        "opening_hours": clinic.opening_hours,
        "timezone": clinic.timezone,
    }
