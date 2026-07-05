import json

from app.models.clinic import Clinic
from app.models.doctor import Doctor

RECEPTIONIST_SYSTEM_PROMPT = """You are the virtual receptionist for a dental clinic.
Answer patient questions about clinic hours, doctors, fees, address, and other clinic
information using ONLY the clinic data provided below. If the answer isn't in the data,
say you're not sure and suggest calling the clinic directly. Keep answers short and friendly.

Clinic data:
{clinic_data}
"""


def build_receptionist_system_prompt(clinic: Clinic | None, doctors: list[Doctor]) -> str:
    clinic_data = {
        "name": clinic.name if clinic else None,
        "address": clinic.address if clinic else None,
        "phone": clinic.phone if clinic else None,
        "email": clinic.email if clinic else None,
        "opening_hours": clinic.opening_hours if clinic else None,
        "timezone": clinic.timezone if clinic else None,
        "doctors": [
            {
                "name": doctor.name,
                "specialty": doctor.specialty,
                "working_hours": doctor.working_hours,
                "consultation_fee": float(doctor.consultation_fee) if doctor.consultation_fee is not None else None,
            }
            for doctor in doctors
        ],
    }
    return RECEPTIONIST_SYSTEM_PROMPT.format(clinic_data=json.dumps(clinic_data, indent=2))
