import { SERVICES } from "@/lib/landingContent";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">Our Services</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {SERVICES.map((service) => (
          <div
            key={service.label}
            className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700"
          >
            <span className="text-2xl">{service.emoji}</span>
            <span className="text-sm font-medium">{service.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
