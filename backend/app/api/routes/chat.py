import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException
from langchain_core.messages import AIMessage, HumanMessage
from openai import OpenAIError
from pydantic import BaseModel, Field
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.graph import build_graph
from app.dependencies import get_checkpointer, get_db
from app.services.conversation_service import append_message, get_or_create_conversation

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatRequest(BaseModel):
    conversation_id: str | None = None
    message: str = Field(min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    conversation_id: str
    reply: str
    agent: str | None = None
    ui: dict | None = None


def _extract_ui_payload(messages: list) -> dict | None:
    last_human_idx = None
    for i in range(len(messages) - 1, -1, -1):
        if isinstance(messages[i], HumanMessage):
            last_human_idx = i
            break
    if last_human_idx is None:
        return None

    for msg in messages[last_human_idx + 1 :]:
        if isinstance(msg, AIMessage) and getattr(msg, "tool_calls", None):
            for call in msg.tool_calls:
                if call["name"] == "propose_booking":
                    return {"type": "booking_summary", **call["args"]}
    return None


@router.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    session: AsyncSession = Depends(get_db),
    checkpointer=Depends(get_checkpointer),
) -> ChatResponse:
    try:
        conversation_id = uuid.UUID(request.conversation_id) if request.conversation_id else None
    except ValueError:
        raise HTTPException(status_code=400, detail="conversation_id must be a valid UUID.")

    conversation = await get_or_create_conversation(session, conversation_id)
    await append_message(session, conversation.id, role="user", content=request.message)

    graph = build_graph(session, checkpointer)
    try:
        result = await graph.ainvoke(
            {"messages": [HumanMessage(content=request.message)]},
            config={"configurable": {"thread_id": str(conversation.id)}},
        )
    except OpenAIError:
        logger.exception("OpenAI request failed for conversation %s", conversation.id)
        raise HTTPException(status_code=502, detail="The assistant is temporarily unavailable. Please try again.")
    except SQLAlchemyError:
        logger.exception("Database error while handling conversation %s", conversation.id)
        raise HTTPException(status_code=500, detail="Something went wrong on our end. Please try again.")

    reply = result["messages"][-1].content
    agent = result.get("last_agent")
    ui = _extract_ui_payload(result["messages"])
    logger.info("conversation=%s agent=%s ui=%s", conversation.id, agent, ui.get("type") if ui else None)

    await append_message(session, conversation.id, role="assistant", content=reply, agent=agent)

    return ChatResponse(conversation_id=str(conversation.id), reply=reply, agent=agent, ui=ui)
