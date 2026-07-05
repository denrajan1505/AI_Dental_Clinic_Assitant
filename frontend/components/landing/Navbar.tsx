export default function Navbar({ onBook }: { onBook: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-black/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-base">🦷</span>
          <span className="font-semibold">Bright Smile Dental</span>
        </div>
        <nav className="hidden gap-6 text-sm text-gray-600 sm:flex dark:text-gray-300">
          <a href="#doctors" className="hover:text-gray-900 dark:hover:text-white">
            Doctors
          </a>
          <a href="#services" className="hover:text-gray-900 dark:hover:text-white">
            Treatments
          </a>
          <a href="#reviews" className="hover:text-gray-900 dark:hover:text-white">
            Reviews
          </a>
          <a href="#contact" className="hover:text-gray-900 dark:hover:text-white">
            Contact
          </a>
        </nav>
        <button
          onClick={onBook}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </div>
    </header>
  );
}
