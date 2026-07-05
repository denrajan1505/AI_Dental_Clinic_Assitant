import { Doctor } from "@/lib/types";
import DoctorCard from "./DoctorCard";

export default function DoctorCardList({ doctors, onBook }: { doctors: Doctor[]; onBook: (doctor: Doctor) => void }) {
  if (doctors.length === 0) {
    return <p className="text-sm text-gray-500">No doctors are available right now.</p>;
  }
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} />
      ))}
    </div>
  );
}
