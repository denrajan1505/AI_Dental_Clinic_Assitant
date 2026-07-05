"use client";

import { useEffect, useState } from "react";
import { getClinicInfo } from "@/lib/api";
import { ClinicInfo } from "@/lib/types";

export default function ContactSection() {
  const [clinic, setClinic] = useState<ClinicInfo | null>(null);

  useEffect(() => {
    getClinicInfo()
      .then(setClinic)
      .catch(() => setClinic(null));
  }, []);

  if (!clinic) return null;

  return (
    <section id="contact" className="border-t border-gray-200 py-10 dark:border-gray-800">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-600 dark:text-gray-300">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Contact</h2>
        <p>📍 {clinic.address}</p>
        {clinic.phone && <p className="mt-1">📞 {clinic.phone}</p>}
        {clinic.email && <p className="mt-1">✉️ {clinic.email}</p>}
      </div>
    </section>
  );
}
