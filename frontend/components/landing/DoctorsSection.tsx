"use client";

import { useEffect, useState } from "react";
import { getDoctors } from "@/lib/api";
import DoctorCard from "@/components/chat/DoctorCard";
import { Doctor } from "@/lib/types";

export default function DoctorsSection({ onBook }: { onBook: (doctor: Doctor) => void }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(() => setDoctors([]));
  }, []);

  if (doctors.length === 0) return null;

  return (
    <section id="doctors" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">Meet Our Doctors</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} />
        ))}
      </div>
    </section>
  );
}
