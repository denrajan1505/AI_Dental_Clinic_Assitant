from datetime import datetime

from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.appointment.prompts import APPOINTMENT_SYSTEM_PROMPT
from app.agents.appointment.tools import build_appointment_tools
from app.agents.state import ConversationState
from app.config import settings
from app.services.appointment_service import CLINIC_TZ

_llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key)


def build_appointment_node(session: AsyncSession):
    tools = build_appointment_tools(session)
    llm_with_tools = _llm.bind_tools(tools)

    async def appointment_node(state: ConversationState) -> dict:
        today = datetime.now(CLINIC_TZ).strftime("%A, %Y-%m-%d")
        system_prompt = f"{APPOINTMENT_SYSTEM_PROMPT}\n\nToday's date is {today} ({CLINIC_TZ.key})."
        messages = [SystemMessage(content=system_prompt), *state["messages"]]
        response = await llm_with_tools.ainvoke(messages)
        return {"messages": [response], "last_agent": "appointment"}

    return appointment_node, tools


def route_from_appointment(state: ConversationState) -> str:
    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "appointment_tools"
    return "end"
