import Reveal from "./Reveal";
import { LeadCaptureTrigger } from "./LeadCapture";

const trustSignals = [
  {
    title: "משלוח חינם",
    sub: "לכל הארץ",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="17" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: "אחריות",
    sub: "לשנתיים מלאות",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M12 3 4 6v5.5c0 4.5 3.4 8.3 8 9.5 4.6-1.2 8-5 8-9.5V6l-8-3Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="m8.5 12 2.5 2.5 4.5-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "30 יום",
    sub: "החזרה ללא שאלות",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M4 12a8 8 0 1 0 2.4-5.7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M4 4v4h4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "וואטסאפ",
    sub: "מענה אנושי בארץ",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27z" />
      </svg>
    ),
  },
];

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden border-t border-line/60 bg-ink text-cream"
      aria-labelledby="final-cta-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 noise opacity-[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-clay/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-40%] start-[-20%] h-[400px] w-[400px] rounded-full bg-cream/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-5 py-18 text-center sm:px-8 sm:py-24 lg:py-28">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/8 px-3 py-1.5 text-[12px] font-medium text-cream/80 backdrop-blur-md">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
            </span>
            אצווה ראשונה · מקומות מוגבלים
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2
            id="final-cta-heading"
            className="font-display mt-6 text-[2.125rem] font-medium leading-[1.1] tracking-tight text-cream sm:text-[2.65rem] sm:leading-[1.05]"
          >
            המקום שלכם ברשימת ההשקה
            <br />
            <span className="font-light text-cream/82">ממתין רק לפרטים.</span>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-md text-[15.5px] leading-relaxed text-cream/68">
            30 שניות מילוי · עדכון אחד כשהמלאי מגיע · 10% הנחה אישית.
            <br className="hidden sm:block" />
            <span className="text-cream/55">בלי ספאם, בלי חיוב מראש.</span>
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="mx-auto mt-9 flex w-full max-w-md flex-col gap-3">
            <LeadCaptureTrigger className="group inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-cream px-8 text-[15px] font-semibold text-ink shadow-[0_24px_48px_-18px_rgba(0,0,0,0.55)] transition hover:bg-white hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.45)] active:scale-[0.99]">
              <span>שרינו לי 10% הנחה להשקה</span>
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                aria-hidden
              >
                <path
                  d="M11.5 5 5.5 10l6 5M5.5 10h9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </LeadCaptureTrigger>
            <a
              href="https://wa.me/972500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-cream/20 px-6 text-[14px] font-medium text-cream/85 transition hover:bg-cream/10"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27z" />
              </svg>
              <span>קודם יש לי שאלה</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <ul className="mt-10 grid grid-cols-2 gap-3 border-t border-cream/12 pt-8 sm:mt-12 sm:grid-cols-4 sm:gap-4 sm:pt-10">
            {trustSignals.map((s) => (
              <li
                key={s.title}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-cream/8 text-clay ring-1 ring-cream/12">
                  {s.icon}
                </span>
                <p className="font-display mt-1 text-[13px] font-medium text-cream">
                  {s.title}
                </p>
                <p className="text-[11px] text-cream/55">{s.sub}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
