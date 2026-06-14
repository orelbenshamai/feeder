import Link from "next/link";

export default function GhostCTAButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/feeder"
      className={`
        group inline-flex items-center justify-center gap-4
        border-2 border-cream/70 bg-transparent
        px-12 py-5
        text-lg font-bold uppercase tracking-widest text-cream
        rounded-sm
        shadow-[0_16px_56px_rgba(0,0,0,0.65)]
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hover:border-cream hover:bg-cream/[0.08]
        hover:shadow-[0_20px_64px_rgba(0,0,0,0.75)]
        lg:px-14 lg:py-6 lg:text-xl
        ${className}
      `}
    >
      <span>קנו עכשיו</span>
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1 lg:h-6 lg:w-6" aria-hidden>
        <path d="M11.5 5 5.5 10l6 5M5.5 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
