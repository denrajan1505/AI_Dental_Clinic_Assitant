import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation import Conversation
from app.models.message import Message


async def get_or_create_conversation(session: AsyncSession, conversation_id: uuid.UUID | None) -> Conversation:
    if conversation_id:
        conversation = await session.get(Conversation, conversation_id)
        if conversation:
            return conversation
    conversation = Conversation(id=conversation_id) if conversation_id else Conversation()
    session.add(conversation)
    await session.commit()
    await session.refresh(conversation)
    return conversation


async def append_message(
    session: AsyncSession, conversation_id: uuid.UUID, role: str, content: str, agent: str | None = None
) -> Message:
    message = Message(conversation_id=conversation_id, role=role, content=content, agent=agent)
    session.add(message)
    await session.commit()
    await session.refresh(message)
    return message


async def list_messages(session: AsyncSession, conversation_id: uuid.UUID) -> list[Message]:
    result = await session.execute(
        select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
    )
    return list(result.scalars().all())
