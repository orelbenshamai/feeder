import { whatsAppHref } from "@/lib/whatsapp";
import Reveal from "./Reveal";
import { LeadCaptureTrigger } from "./LeadCapture";

const trustSignals = [
  {
    title: "משלוח חינם",
    sub: "לכל הארץ",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path
          d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "אחריות",
    sub: "לשנתיים מלאות",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path
          d="M12 3 4 6v5.5c0 4.5 3.4 8.3 8 9.5 4.6-1.2 8-5 8-9.5V6l-8-3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="m8.5 12 2.5 2.5 4.5-5"
          stroke="currentColor"
          strokeWidth="1.8"
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
      <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" aria-hidden>
        <path
          d="M4 12a8 8 0 1 0 2.4-5.7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M4 4v4h4"
          stroke="currentColor"
          strokeWidth="1.6"
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
      <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" aria-hidden>
        <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27z" />
      </svg>
    ),
  },
];

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="
        relative isolate flex h-[100svh] max-h-[100svh] min-h-[100svh] flex-col overflow-hidden
        text-cream bg-[#071520]
        max-lg:h-[var(--app-vh,100svh)] max-lg:max-h-[var(--app-vh,100svh)] max-lg:min-h-[var(--app-vh,100svh)]
        shadow-[0_-24px_60px_-24px_rgba(31,58,82,0.18)]
        mt-0
      "
      aria-labelledby="final-cta-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 noise opacity-[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 start-1/2 z-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-clay/18 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-30%] start-[-20%] z-0 h-[280px] w-[280px] rounded-full bg-cream/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl min-h-0 flex-col justify-center px-4 py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8 sm:py-6">
        <div className="flex min-h-0 flex-col items-center gap-4 text-center sm:gap-5">
          <Reveal delay={80}>
            <div>
              <h2
                id="final-cta-heading"
                className="section-h2 section-h2-on-dark text-[clamp(1.5rem,5.5vw,2.35rem)] leading-[1.1]"
              >
                המקום שלכם ברשימת ההשקה
                <br />
                <span className="font-light text-cream/82">ממתין רק לפרטים</span>
              </h2>
              <p className="section-lead section-lead-on-dark mx-auto mt-2.5 max-w-md text-[14px] leading-[1.6] sm:mt-3 sm:text-[16px] sm:leading-[1.65]">
                <span className="max-sm:block">
                  30 שניות מילוי · עדכון כשהמלאי מגיע · 10% הנחה
                </span>
                <span className="mt-1 block text-[13px] text-cream/55 sm:text-[14px]">
                  בלי ספאם, בלי חיוב מראש
                </span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="flex w-full max-w-sm flex-col gap-2 sm:max-w-md sm:gap-2.5">
              <LeadCaptureTrigger className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-clay px-5 text-[13.5px] font-semibold text-ink shadow-[0_20px_40px_-16px_rgba(255,159,10,0.5)] transition hover:bg-clay/90 active:scale-[0.99] sm:min-h-[52px] sm:px-7 sm:text-[14px]">
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
                href={whatsAppHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-cream/20 px-4 text-[13px] font-medium text-cream/85 transition hover:bg-cream/10 sm:min-h-[44px] sm:text-[13.5px]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M19.05 4.92A10.05 10.05 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.27 4.86L2 22l5.27-1.38A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.69-1.05-5.21-2.95-7.08zM12 20.27a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.83-3.05-.2-.31A8.27 8.27 0 1 1 12 20.27z" />
                </svg>
                <span>קודם יש לי שאלה</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <ul className="grid w-full max-w-lg grid-cols-2 gap-x-3 gap-y-3 border-t border-cream/12 pt-4 sm:grid-cols-4 sm:gap-4 sm:pt-5">
              {trustSignals.map((s) => (
                <li
                  key={s.title}
                  className="flex flex-col items-center gap-1 text-center sm:gap-1.5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-cream/8 text-clay ring-1 ring-cream/12 sm:h-11 sm:w-11">
                    {s.icon}
                  </span>
                  <p className="font-display text-[12.5px] font-semibold leading-tight text-cream sm:text-[13px]">
                    {s.title}
                  </p>
                  <p className="text-[10.5px] leading-snug text-cream/60 sm:text-[11px]">
                    {s.sub}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
