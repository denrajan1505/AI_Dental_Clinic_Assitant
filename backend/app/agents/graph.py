from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.appointment.node import build_appointment_node, route_from_appointment
from app.agents.manager.node import manager_direct_reply_node, manager_node, route_from_manager
from app.agents.receptionist.node import build_receptionist_node
from app.agents.state import ConversationState


def build_graph(session: AsyncSession, checkpointer):
    graph = StateGraph(ConversationState)
    graph.add_node("manager", manager_node)
    graph.add_node("receptionist", build_receptionist_node(session))
    graph.add_node("manager_direct_reply", manager_direct_reply_node)

    appointment_node, appointment_tools = build_appointment_node(session)
    graph.add_node("appointment", appointment_node)
    graph.add_node("appointment_tools", ToolNode(appointment_tools))

    graph.add_edge(START, "manager")
    graph.add_conditional_edges(
        "manager",
        route_from_manager,
        {
            "receptionist": "receptionist",
            "appointment": "appointment",
            "manager_direct_reply": "manager_direct_reply",
        },
    )
    graph.add_edge("receptionist", END)
    graph.add_edge("manager_direct_reply", END)

    graph.add_conditional_edges(
        "appointment",
        route_from_appointment,
        {"appointment_tools": "appointment_tools", "end": END},
    )
    graph.add_edge("appointment_tools", "appointment")

    return graph.compile(checkpointer=checkpointer)
