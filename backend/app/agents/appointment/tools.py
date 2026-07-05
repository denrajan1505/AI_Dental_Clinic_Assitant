import uuid
from datetime import datetime

from langchain_core.tools import tool
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import appointment_service as svc


def build_appointment_tools(session: AsyncSession) -> list:
    async def _no_doctor_match_message(doctor_name: str) -> str:
        suggestions = await svc.suggest_doctor_names(session, doctor_name)
        if not suggestions:
            return f"I couldn't find a doctor named '{doctor_name}' at this clinic."
        return (
            f"I couldn't find \"{doctor_name}\". Did you mean: "
            + ", ".join(suggestions)
            + "? Please choose one."
        )

    @tool
    async def check_availability(doctor_name: str, date: str) -> str:
        """Check a doctor's available appointment slots on a given date (format: YYYY-MM-DD)."""
        doctor = await svc.find_doctor_by_name(session, doctor_name)
        if not doctor:
            return await _no_doctor_match_message(doctor_name)
        on_date = datetime.strptime(date, "%Y-%m-%d").date()
        slots = await svc.get_available_slots(session, doctor, on_date)
        if not slots:
            return f"Dr. {doctor.name} has no available slots on {date}."
        return f"Dr. {doctor.name} is available on {date} at: {', '.join(slots)}"

    @tool
    async def book_appointment(doctor_name: str, patient_name: str, patient_phone: str, date: str, time: str) -> str:
        """Book an appointment for a patient with a doctor at a given date (YYYY-MM-DD) and time (HH:MM)."""
        doctor = await svc.find_doctor_by_name(session, doctor_name)
        if not doctor:
            return await _no_doctor_match_message(doctor_name)
        start_time = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M").replace(tzinfo=svc.CLINIC_TZ)
        patient = await svc.get_or_create_patient(session, patient_name, patient_phone)
        try:
            appointment = await svc.create_appointment(session, doctor, patient, start_time)
        except svc.SchedulingError as exc:
            return str(exc)
        return (
            f"Booked: {patient.name} with Dr. {doctor.name} on {date} at {time}. "
            f"Appointment ID: {appointment.id}."
        )

    @tool
    async def reschedule_appointment(appointment_id: str, new_date: str, new_time: str) -> str:
        """Reschedule an existing appointment (by its ID) to a new date (YYYY-MM-DD) and time (HH:MM)."""
        new_start_time = datetime.strptime(f"{new_date} {new_time}", "%Y-%m-%d %H:%M").replace(tzinfo=svc.CLINIC_TZ)
        try:
            appointment = await svc.reschedule_appointment(session, uuid.UUID(appointment_id), new_start_time)
        except svc.SchedulingError as exc:
            return str(exc)
        return f"Appointment {appointment.id} rescheduled to {new_date} at {new_time}."

    @tool
    async def cancel_appointment(appointment_id: str) -> str:
        """Cancel an existing appointment by its ID."""
        try:
            appointment = await svc.cancel_appointment(session, uuid.UUID(appointment_id))
        except svc.SchedulingError as exc:
            return str(exc)
        return f"Appointment {appointment.id} has been cancelled."

    @tool
    async def propose_booking(
        doctor_name: str, patient_name: str, patient_phone: str, date: str, time: str, reason: str = ""
    ) -> str:
        """Present a booking summary to the patient for confirmation before calling book_appointment.
        Call this once you have gathered the doctor, date, time, patient name, and phone number, and
        before actually booking. Do not call book_appointment until the patient confirms this summary."""
        return (
            f"Please confirm this appointment: Dr. {doctor_name} on {date} at {time} for "
            f"{patient_name} ({patient_phone})" + (f", reason: {reason}" if reason else "") + "."
        )

    @tool
    async def check_my_appointments(patient_phone: str) -> str:
        """Look up a patient's existing appointments by their phone number."""
        appointments = await svc.get_appointments_by_phone(session, patient_phone)
        if not appointments:
            return f"No appointments found for phone number {patient_phone}."
        lines = [
            f"- {appt['doctor_name']} on {appt['start_time'].strftime('%Y-%m-%d %H:%M')} "
            f"({appt['status']}), ID: {appt['appointment_id']}"
            for appt in appointments
        ]
        return "Found the following appointments:\n" + "\n".join(lines)

    return [
        check_availability,
        book_appointment,
        reschedule_appointment,
        cancel_appointment,
        propose_booking,
        check_my_appointments,
    ]
