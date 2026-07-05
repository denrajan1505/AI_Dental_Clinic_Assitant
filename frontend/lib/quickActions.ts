export type QuickActionKind = "message" | "doctors" | "fees" | "emergency";

export interface QuickAction {
  id: string;
  emoji: string;
  label: string;
  kind: QuickActionKind;
  message?: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "book", emoji: "📅", label: "Book Appointment", kind: "message", message: "I'd like to book an appointment." },
  { id: "doctors", emoji: "👨‍⚕️", label: "Doctors", kind: "doctors" },
  { id: "fees", emoji: "💰", label: "Fees", kind: "fees" },
  {
    id: "treatments",
    emoji: "🦷",
    label: "Treatments",
    kind: "message",
    message: "Tell me about the treatments you offer.",
  },
  { id: "location", emoji: "📍", label: "Location", kind: "message", message: "Where is the clinic located?" },
  { id: "contact", emoji: "☎️", label: "Contact", kind: "message", message: "What's your contact number?" },
  { id: "emergency", emoji: "🚨", label: "Emergency", kind: "emergency" },
];

export const WELCOME_CTA_IDS = ["book", "treatments", "emergency"];
