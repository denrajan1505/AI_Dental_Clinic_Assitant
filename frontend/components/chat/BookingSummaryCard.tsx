import { UIPayload } from "@/lib/types";

type BookingSummary = Extract<UIPayload, { type: "booking_summary" }>;

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function BookingSummaryCard({
  summary,
  onConfirm,
  onCancel,
}: {
  summary: BookingSummary;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="w-64 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
      <p className="mb-2 text-sm font-semibold">Appointment Summary</p>
      <div className="space-y-1">
        <Row label="Doctor" value={summary.doctor_name} />
        <Row label="Date" value={summary.date} />
        <Row label="Time" value={summary.time} />
        <Row label="Patient" value={summary.patient_name} />
        <Row label="Reason" value={summary.reason} />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 rounded-full bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          Confirm Booking
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-full border border-gray-300 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
