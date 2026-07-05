import { ChatMessage, ChatResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function sendMessage(message: string, conversationId: string | null): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });
  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`);
  }
  return res.json();
}

export async function getHistory(conversationId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`);
  if (!res.ok) {
    throw new Error(`Failed to load history: ${res.status}`);
  }
  return res.json();
}
