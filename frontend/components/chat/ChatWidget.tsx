"use client";

import { useEffect, useState } from "react";
import { getClinicInfo, getDoctors, getHistory, sendMessage } from "@/lib/api";
import { QuickAction } from "@/lib/quickActions";
import { ChatMessage, Doctor } from "@/lib/types";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import QuickActions from "./QuickActions";
import WelcomeScreen from "./WelcomeScreen";

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
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.reply,
          agent: response.agent,
          ui: response.ui,
        },
      ]);
    } catch {
      setError("Something went wrong sending your message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleQuickAction(action: QuickAction) {
    if (action.kind === "message") {
      if (action.message) handleSend(action.message);
      return;
    }

    setError(null);
    setIsSending(true);
    try {
      if (action.kind === "doctors" || action.kind === "fees") {
        const doctors: Doctor[] = await getDoctors();
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: action.kind === "fees" ? "Here are our consultation fees:" : "Here are our doctors:",
            ui: { type: "doctor_cards", doctors },
          },
        ]);
      } else if (action.kind === "emergency") {
        const clinic = await getClinicInfo();
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "This may require immediate attention.",
            ui: { type: "emergency", clinic },
          },
        ]);
      }
    } catch {
      setError("Something went wrong loading that. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-[640px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700">
      <div className="flex items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-lg">🦷</div>
        <div>
          <h1 className="text-base font-semibold">AI Receptionist</h1>
          <p className="text-xs text-green-600">🟢 Online</p>
        </div>
      </div>
      {messages.length === 0 ? (
        <WelcomeScreen onAction={handleQuickAction} />
      ) : (
        <MessageList messages={messages} isSending={isSending} onSend={handleSend} />
      )}
      {error && <p className="px-4 pb-2 text-xs text-red-600">{error}</p>}
      <QuickActions onAction={handleQuickAction} disabled={isSending} />
      <ChatInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
