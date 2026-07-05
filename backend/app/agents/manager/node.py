from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI

from app.agents.manager.prompts import MANAGER_CLASSIFY_SYSTEM_PROMPT, MANAGER_DIRECT_REPLY_SYSTEM_PROMPT
from app.agents.manager.schemas import IntentClassification
from app.agents.state import ConversationState
from app.config import settings

_llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key)
_classifier = _llm.with_structured_output(IntentClassification)


async def manager_node(state: ConversationState) -> dict:
    messages = [SystemMessage(content=MANAGER_CLASSIFY_SYSTEM_PROMPT), *state["messages"]]
    classification: IntentClassification = await _classifier.ainvoke(messages)
    return {
        "intent": classification.intent,
        "appointment_action": classification.appointment_action,
        "doctor_name": classification.doctor_name,
        "preferred_date": classification.preferred_date,
        "preferred_time": classification.preferred_time,
        "last_agent": "manager",
    }


async def manager_direct_reply_node(state: ConversationState) -> dict:
    messages = [SystemMessage(content=MANAGER_DIRECT_REPLY_SYSTEM_PROMPT), *state["messages"]]
    response = await _llm.ainvoke(messages)
    return {"messages": [response], "last_agent": "manager"}


def route_from_manager(state: ConversationState) -> str:
    intent = state.get("intent")
    if intent == "receptionist_info":
        return "receptionist"
    if intent == "appointment_action":
        return "appointment"
    return "manager_direct_reply"
