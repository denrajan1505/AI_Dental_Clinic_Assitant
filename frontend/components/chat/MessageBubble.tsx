import { ChatMessage, Doctor } from "@/lib/types";
import BookingSummaryCard from "./BookingSummaryCard";
import DoctorCardList from "./DoctorCardList";
import EmergencyCard from "./EmergencyCard";

export default function MessageBubble({
  message,
  onSend,
}: {
  message: ChatMessage;
  onSend: (text: string) => void;
}) {
  const isUser = message.role === "user";

  function renderUi() {
    if (!message.ui) return null;
    if (message.ui.type === "doctor_cards") {
      return (
        <DoctorCardList
          doctors={message.ui.doctors}
          onBook={(doctor: Doctor) => onSend(`I'd like to book an appointment with ${doctor.name}`)}
        />
      );
    }
    if (message.ui.type === "booking_summary") {
      return (
        <BookingSummaryCard
          summary={message.ui}
          onConfirm={() => onSend("Yes, please proceed.")}
          onCancel={() => onSend("No, cancel that.")}
        />
      );
    }
    if (message.ui.type === "emergency") {
      return <EmergencyCard clinic={message.ui.clinic} />;
    }
    return null;
  }

  const ui = renderUi();

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${ui ? "" : "rounded-2xl px-4 py-2"} text-sm whitespace-pre-wrap ${
        ui ? "" : isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      }`}
      >
        {ui ?? message.content}
      </div>
    </div>
  );
}
