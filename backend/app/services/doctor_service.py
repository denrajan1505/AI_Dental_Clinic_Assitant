from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.doctor import Doctor


async def list_active_doctors(session: AsyncSession) -> list[Doctor]:
    result = await session.execute(select(Doctor).where(Doctor.is_active.is_(True)))
    return list(result.scalars().all())
