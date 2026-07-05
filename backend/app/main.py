import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.agents.checkpointer import lifespan_checkpointer
from app.api.routes import chat, conversations, doctors, health
from app.config import settings

logging.basicConfig(
    level=logging.INFO if settings.env == "production" else logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with lifespan_checkpointer() as checkpointer:
        app.state.checkpointer = checkpointer
        yield


app = FastAPI(title="AI Dental Clinic Assistant", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(health.router)
app.include_router(doctors.router)
app.include_router(chat.router)
app.include_router(conversations.router)
