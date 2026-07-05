import difflib
import uuid
from datetime import date as date_type
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.patient import Patient

SLOT_DURATION_MINUTES = 30
ACTIVE_STATUSES = ("pending", "confirmed", "rescheduled")
WEEKDAY_KEYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
CLINIC_TZ = ZoneInfo("Asia/Kolkata")


class SchedulingError(Exception):
    pass


async def find_doctor_by_name(session: AsyncSession, name: str) -> Doctor | None:
    result = await session.execute(
        select(Doctor).where(Doctor.name.ilike(f"%{name}%"), Doctor.is_active.is_(True))
    )
    return result.scalars().first()


async def suggest_doctor_names(session: AsyncSession, name: str, limit: int = 3) -> list[str]:
    result = await session.execute(select(Doctor.name).where(Doctor.is_active.is_(True)))
    all_names = [row[0] for row in result.all()]
    return difflib.get_close_matches(name, all_names, n=limit, cutoff=0.4)


async def get_appointments_by_phone(session: AsyncSession, phone: str) -> list[dict]:
    result = await session.execute(
        select(Appointment, Doctor)
        .join(Doctor, Appointment.doctor_id == Doctor.id)
        .join(Patient, Appointment.patient_id == Patient.id)
        .where(Patient.phone == phone)
        .order_by(Appointment.start_time)
    )
    return [
        {
            "appointment_id": str(appointment.id),
            "doctor_name": doctor.name,
            "start_time": appointment.start_time.astimezone(CLINIC_TZ),
            "status": appointment.status,
        }
        for appointment, doctor in result.all()
    ]


async def list_all_appointments(session: AsyncSession) -> list[dict]:
    result = await session.execute(
        select(Appointment, Doctor, Patient)
        .join(Doctor, Appointment.doctor_id == Doctor.id)
        .join(Patient, Appointment.patient_id == Patient.id)
        .order_by(Appointment.start_time.desc())
    )
    return [
        {
            "appointment_id": str(appointment.id),
            "doctor_name": doctor.name,
            "patient_name": patient.name,
            "patient_phone": patient.phone,
            "start_time": appointment.start_time.astimezone(CLINIC_TZ),
            "status": appointment.status,
        }
        for appointment, doctor, patient in result.all()
    ]


def _parse_time(value: str) -> time:
    return datetime.strptime(value, "%H:%M").time()


async def get_available_slots(session: AsyncSession, doctor: Doctor, on_date: date_type) -> list[str]:
    weekday_key = WEEKDAY_KEYS[on_date.weekday()]
    hours = doctor.working_hours.get(weekday_key)
    if not hours:
        return []

    day_start = datetime.combine(on_date, _parse_time(hours[0]), tzinfo=CLINIC_TZ)
    day_end = datetime.combine(on_date, _parse_time(hours[1]), tzinfo=CLINIC_TZ)

    result = await session.execute(
        select(Appointment).where(
            Appointment.doctor_id == doctor.id,
            Appointment.status.in_(ACTIVE_STATUSES),
            Appointment.start_time >= day_start,
            Appointment.start_time < day_end,
        )
    )
    booked_starts = {appt.start_time for appt in result.scalars().all()}

    slots = []
    delta = timedelta(minutes=SLOT_DURATION_MINUTES)
    current = day_start
    while current + delta <= day_end:
        if current not in booked_starts:
            slots.append(current.strftime("%H:%M"))
        current += delta
    return slots


async def get_or_create_patient(session: AsyncSession, name: str, phone: str) -> Patient:
    result = await session.execute(select(Patient).where(Patient.phone == phone))
    patient = result.scalars().first()
    if patient:
        return patient
    patient = Patient(name=name, phone=phone)
    session.add(patient)
    await session.flush()
    return patient


async def _check_conflict(
    session: AsyncSession, doctor_id: uuid.UUID, start_time: datetime, exclude_appointment_id: uuid.UUID | None = None
) -> bool:
    query = select(Appointment).where(
        Appointment.doctor_id == doctor_id,
        Appointment.start_time == start_time,
        Appointment.status.in_(ACTIVE_STATUSES),
    )
    if exclude_appointment_id is not None:
        query = query.where(Appointment.id != exclude_appointment_id)
    result = await session.execute(query)
    return result.scalars().first() is not None


async def create_appointment(
    session: AsyncSession, doctor: Doctor, patient: Patient, start_time: datetime
) -> Appointment:
    if await _check_conflict(session, doctor.id, start_time):
        raise SchedulingError(
            f"Dr. {doctor.name} is already booked at {start_time.strftime('%Y-%m-%d %H:%M')}."
        )

    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        start_time=start_time,
        end_time=start_time + timedelta(minutes=SLOT_DURATION_MINUTES),
        status="confirmed",
    )
    session.add(appointment)
    await session.commit()
    await session.refresh(appointment)
    return appointment


async def reschedule_appointment(
    session: AsyncSession, appointment_id: uuid.UUID, new_start_time: datetime
) -> Appointment:
    appointment = await session.get(Appointment, appointment_id)
    if not appointment:
        raise SchedulingError("Appointment not found.")
    if await _check_conflict(session, appointment.doctor_id, new_start_time, exclude_appointment_id=appointment.id):
        raise SchedulingError("That new time is already booked.")

    duration = appointment.end_time - appointment.start_time
    appointment.start_time = new_start_time
    appointment.end_time = new_start_time + duration
    appointment.status = "rescheduled"
    await session.commit()
    await session.refresh(appointment)
    return appointment


async def cancel_appointment(session: AsyncSession, appointment_id: uuid.UUID) -> Appointment:
    appointment = await session.get(Appointment, appointment_id)
    if not appointment:
        raise SchedulingError("Appointment not found.")
    appointment.status = "cancelled"
    await session.commit()
    await session.refresh(appointment)
    return appointment
