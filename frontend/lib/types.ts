export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Doctor {
  id: string;
  name: string;
  specialty: string | null;
  working_hours: Record<string, [string, string]>;
  consultation_fee: number | null;
}

export interface ClinicInfo {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  opening_hours: Record<string, string>;
  timezone: string;
}

export type UIPayload =
  | { type: "doctor_cards"; doctors: Doctor[] }
  | { type: "emergency"; clinic: ClinicInfo }
  | {
      type: "booking_summary";
      doctor_name?: string;
      patient_name?: string;
      patient_phone?: string;
      date?: string;
      time?: string;
      reason?: string;
    };

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  agent?: string | null;
  ui?: UIPayload | null;
}

export interface ChatResponse {
  conversation_id: string;
  reply: string;
  agent: string | null;
  ui?: UIPayload | null;
}
