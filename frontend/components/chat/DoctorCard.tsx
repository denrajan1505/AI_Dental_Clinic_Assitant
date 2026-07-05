import { Doctor } from "@/lib/types";

export default function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: (doctor: Doctor) => void }) {
  return (
    <div className="w-48 shrink-0 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
      <p className="text-sm font-semibold">👨‍⚕️ {doctor.name}</p>
      {doctor.specialty && <p className="text-xs text-gray-500">{doctor.specialty}</p>}
      {doctor.consultation_fee != null && (
        <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">₹{doctor.consultation_fee} consultation</p>
      )}
      <button
        onClick={() => onBook(doctor)}
        className="mt-2 w-full rounded-full bg-blue-600 py-1 text-xs font-medium text-white hover:bg-blue-700"
      >
        Book
      </button>
    </div>
  );
}
