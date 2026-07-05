"use client";

import { useEffect, useState } from "react";
import { getAppointments } from "@/lib/api";
import { AppointmentRecord } from "@/lib/types";

const SESSION_KEY = "dental_admin_password";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(pw: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments(pw);
      setAppointments(data);
      setAuthed(true);
      sessionStorage.setItem(SESSION_KEY, pw);
    } catch (e) {
      const message = e instanceof Error && e.message === "UNAUTHORIZED" ? "Incorrect password." : "Something went wrong.";
      setError(message);
      setAuthed(false);
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      setPassword(stored);
      load(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authed) {
    return (
      <div className="mx-auto flex max-w-sm flex-col gap-3 p-8">
        <h1 className="text-lg font-semibold">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(password)}
          placeholder="Admin password"
          className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
        />
        <button
          onClick={() => load(password)}
          disabled={loading}
          className="rounded bg-blue-600 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Checking..." : "Log in"}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Appointments</h1>
        <button
          onClick={() => load(password)}
          className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2">Patient</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Doctor</th>
              <th className="px-3 py-2">Date &amp; Time</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.appointment_id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-3 py-2">{a.patient_name}</td>
                <td className="px-3 py-2">{a.patient_phone}</td>
                <td className="px-3 py-2">{a.doctor_name}</td>
                <td className="px-3 py-2">{new Date(a.start_time).toLocaleString()}</td>
                <td className="px-3 py-2 capitalize">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <p className="p-4 text-sm text-gray-500">No appointments yet.</p>}
      </div>
    </div>
  );
}
