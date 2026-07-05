export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  agent?: string | null;
}

export interface ChatResponse {
  conversation_id: string;
  reply: string;
  agent: string | null;
}
