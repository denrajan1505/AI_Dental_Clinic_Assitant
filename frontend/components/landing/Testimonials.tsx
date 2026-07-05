import { TESTIMONIALS } from "@/lib/landingContent";

export default function Testimonials() {
  return (
    <section id="reviews" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">Testimonials</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm text-yellow-500">{"⭐".repeat(t.stars)}</p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-2 text-xs font-medium text-gray-500">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
