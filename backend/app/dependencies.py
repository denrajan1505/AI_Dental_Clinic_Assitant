from typing import AsyncGenerator

from fastapi import Header, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.base import async_session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session


def get_checkpointer(request: Request):
    return request.app.state.checkpointer


async def require_admin(x_admin_password: str = Header(...)) -> None:
    if x_admin_password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Invalid admin password.")
