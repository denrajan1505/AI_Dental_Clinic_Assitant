import { AppointmentRecord, ChatMessage, ChatResponse, ClinicInfo, Doctor } from "./types";

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

export async function getDoctors(): Promise<Doctor[]> {
  const res = await fetch(`${API_BASE_URL}/api/doctors`);
  if (!res.ok) {
    throw new Error(`Failed to load doctors: ${res.status}`);
  }
  return res.json();
}

export async function getClinicInfo(): Promise<ClinicInfo> {
  const res = await fetch(`${API_BASE_URL}/api/clinic`);
  if (!res.ok) {
    throw new Error(`Failed to load clinic info: ${res.status}`);
  }
  return res.json();
}

export async function getAppointments(adminPassword: string): Promise<AppointmentRecord[]> {
  const res = await fetch(`${API_BASE_URL}/api/appointments`, {
    headers: { "X-Admin-Password": adminPassword },
  });
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) {
    throw new Error(`Failed to load appointments: ${res.status}`);
  }
  return res.json();
}
