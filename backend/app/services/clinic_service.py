from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.clinic import Clinic


async def get_clinic(session: AsyncSession) -> Clinic | None:
    result = await session.execute(select(Clinic).limit(1))
    return result.scalars().first()
