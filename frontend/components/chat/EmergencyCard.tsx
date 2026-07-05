import { ClinicInfo } from "@/lib/types";

export default function EmergencyCard({ clinic }: { clinic: ClinicInfo }) {
  return (
    <div className="w-64 rounded-xl border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
      <p className="text-sm font-semibold text-red-700 dark:text-red-300">⚠ This may require immediate attention</p>
      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
        If this is a serious emergency, please call the clinic right away.
      </p>
      {clinic.phone && (
        <a
          href={`tel:${clinic.phone}`}
          className="mt-3 block rounded-full bg-red-600 py-1.5 text-center text-xs font-medium text-white hover:bg-red-700"
        >
          📞 Call Clinic: {clinic.phone}
        </a>
      )}
    </div>
  );
}
