"use client";

import { useEffect, useState } from "react";
import { getHistory, sendMessage } from "@/lib/api";
import { ChatMessage } from "@/lib/types";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

const STORAGE_KEY = "dental_assistant_conversation_id";

export default function ChatWidget() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (!storedId) return;
    setConversationId(storedId);
    getHistory(storedId)
      .then(setMessages)
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setConversationId(null);
      });
  }, []);

  async function handleSend(text: string) {
    setError(null);
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    try {
      const response = await sendMessage(text, conversationId);
      setConversationId(response.conversation_id);
      localStorage.setItem(STORAGE_KEY, response.conversation_id);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: response.reply, agent: response.agent },
      ]);
    } catch {
      setError("Something went wrong sending your message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-[600px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700">
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h1 className="text-base font-semibold">Dental Clinic Assistant</h1>
        <p className="text-xs text-gray-500">Ask about hours, doctors, fees, or book an appointment</p>
      </div>
      <MessageList messages={messages} />
      {error && <p className="px-4 pb-2 text-xs text-red-600">{error}</p>}
      <ChatInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
