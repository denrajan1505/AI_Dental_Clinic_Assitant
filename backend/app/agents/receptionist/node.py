from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.receptionist.prompts import build_receptionist_system_prompt
from app.agents.state import ConversationState
from app.config import settings
from app.services.clinic_service import get_clinic
from app.services.doctor_service import list_active_doctors

_llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key)


def build_receptionist_node(session: AsyncSession):
    async def receptionist_node(state: ConversationState) -> dict:
        clinic = await get_clinic(session)
        doctors = await list_active_doctors(session)
        system_prompt = build_receptionist_system_prompt(clinic, doctors)
        messages = [SystemMessage(content=system_prompt), *state["messages"]]
        response = await _llm.ainvoke(messages)
        return {"messages": [response], "last_agent": "receptionist"}

    return receptionist_node
