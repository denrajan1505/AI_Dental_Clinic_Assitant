from typing import Annotated, Literal, Optional, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class ConversationState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    intent: Optional[Literal["receptionist_info", "appointment_action", "chitchat", "unclear"]]
    appointment_action: Optional[Literal["book", "reschedule", "cancel", "check_availability"]]
    doctor_name: Optional[str]
    preferred_date: Optional[str]
    preferred_time: Optional[str]
    last_agent: Optional[str]
