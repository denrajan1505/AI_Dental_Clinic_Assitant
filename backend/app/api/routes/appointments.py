from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_admin
from app.services.appointment_service import list_all_appointments

router = APIRouter()


@router.get("/api/appointments", dependencies=[Depends(require_admin)])
async def get_appointments(session: AsyncSession = Depends(get_db)) -> list[dict]:
    appointments = await list_all_appointments(session)
    return [
        {
            "appointment_id": a["appointment_id"],
            "doctor_name": a["doctor_name"],
            "patient_name": a["patient_name"],
            "patient_phone": a["patient_phone"],
            "start_time": a["start_time"].isoformat(),
            "status": a["status"],
        }
        for a in appointments
    ]
