import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.services.conversation_service import list_messages

router = APIRouter()


@router.get("/api/conversations/{conversation_id}/messages")
async def get_conversation_messages(conversation_id: uuid.UUID, session: AsyncSession = Depends(get_db)) -> list[dict]:
    messages = await list_messages(session, conversation_id)
    return [
        {
            "id": str(message.id),
            "role": message.role,
            "content": message.content,
            "agent": message.agent,
            "created_at": message.created_at.isoformat(),
        }
        for message in messages
    ]
