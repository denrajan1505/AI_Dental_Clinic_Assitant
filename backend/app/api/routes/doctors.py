from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.services.doctor_service import list_active_doctors

router = APIRouter()


@router.get("/api/doctors")
async def get_doctors(session: AsyncSession = Depends(get_db)) -> list[dict]:
    doctors = await list_active_doctors(session)
    return [
        {
            "id": str(doctor.id),
            "name": doctor.name,
            "specialty": doctor.specialty,
            "working_hours": doctor.working_hours,
            "consultation_fee": float(doctor.consultation_fee) if doctor.consultation_fee is not None else None,
        }
        for doctor in doctors
    ]
