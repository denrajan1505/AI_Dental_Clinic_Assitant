from contextlib import asynccontextmanager

from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from app.config import settings


def _psycopg_dsn() -> str:
    return settings.database_url.replace("postgresql+asyncpg://", "postgresql://")


@asynccontextmanager
async def lifespan_checkpointer():
    async with AsyncPostgresSaver.from_conn_string(_psycopg_dsn()) as checkpointer:
        await checkpointer.setup()
        yield checkpointer
