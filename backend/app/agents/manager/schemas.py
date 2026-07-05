from typing import Literal, Optional

from pydantic import BaseModel


class IntentClassification(BaseModel):
    intent: Literal["receptionist_info", "appointment_action", "chitchat", "unclear"]
    appointment_action: Optional[
        Literal["book", "reschedule", "cancel", "check_availability", "check_status"]
    ] = None
    doctor_name: Optional[str] = None
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
