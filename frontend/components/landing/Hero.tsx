"use client";

import { useEffect, useState } from "react";
import { getClinicInfo } from "@/lib/api";
import { PLACEHOLDER_RATING } from "@/lib/landingContent";
import { ClinicInfo } from "@/lib/types";

function todayHours(clinic: ClinicInfo): string | null {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: clinic.timezone, weekday: "short" })
    .format(new Date())
    .toLowerCase();
  return clinic.opening_hours[weekday] ?? null;
}

export default function Hero({ onBook, onTalkToAI }: { onBook: () => void; onTalkToAI: () => void }) {
  const [clinic, setClinic] = useState<ClinicInfo | null>(null);

  useEffect(() => {
    getClinicInfo()
      .then(setClinic)
      .catch(() => setClinic(null));
  }, []);

  const hours = clinic ? todayHours(clinic) : null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold sm:text-4xl">🏥 {clinic?.name ?? "Bright Smile Dental"}</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">😁 Welcome!</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
        <span>⭐ {PLACEHOLDER_RATING} Rating</span>
        {clinic?.address && <span>📍 {clinic.address}</span>}
        {hours && <span>🕒 Open Today: {hours}</span>}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={onBook}
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          📅 Book Appointment
        </button>
        <button
          onClick={onTalkToAI}
          className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          💬 Talk to AI Receptionist
        </button>
      </div>
    </section>
  );
}
