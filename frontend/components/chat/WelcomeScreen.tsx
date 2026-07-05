import { QUICK_ACTIONS, QuickAction, WELCOME_CTA_IDS } from "@/lib/quickActions";

const CAPABILITIES = [
  { emoji: "📅", label: "Book an Appointment" },
  { emoji: "🦷", label: "Learn about Treatments" },
  { emoji: "👨‍⚕️", label: "Find a Doctor" },
  { emoji: "💰", label: "Treatment Prices" },
  { emoji: "📍", label: "Clinic Location" },
  { emoji: "🕒", label: "Working Hours" },
];

export default function WelcomeScreen({ onAction }: { onAction: (action: QuickAction) => void }) {
  const ctas = WELCOME_CTA_IDS.map((id) => QUICK_ACTIONS.find((a) => a.id === id)).filter(
    (a): a is QuickAction => Boolean(a)
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto p-6 text-center">
      <div>
        <p className="text-lg font-semibold">👋 Welcome to Bright Smile Dental</p>
        <p className="mt-1 text-sm text-gray-500">I&apos;m your AI Receptionist. I can help you with:</p>
      </div>
      <ul className="grid w-full max-w-xs grid-cols-2 gap-x-4 gap-y-2 text-left text-sm text-gray-700 dark:text-gray-300">
        {CAPABILITIES.map((cap) => (
          <li key={cap.label} className="flex items-center gap-2">
            <span>{cap.emoji}</span>
            <span>{cap.label}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-center gap-2">
        {ctas.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {action.emoji} {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
