import ProductIllustration from "./ProductIllustration";
import { LeadCaptureTrigger } from "./LeadCapture";

/** Served from `public/media/ad1.mp4` (Turbopack cannot bundle `.mp4` imports). */
const DEFAULT_HERO_VIDEO = "/media/ad1.mp4";

const QUICK_BENEFITS = [
  "רצפה יבשה אחרי כל ארוחה",
  "קערות נירוסטה — מתאים למדיח",
  "יציב על כל ריצוף · לא זז, לא שורט",
];

export default function Hero() {
  const envSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  const videoSrc = envSrc || DEFAULT_HERO_VIDEO;
  const posterSrc =
    process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER_URL?.trim() || undefined;

  return (
    <section
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden"
      aria-labelledby="hero-heading"
      aria-describedby="hero-visual-desc"
    >
      <span id="hero-visual-desc" className="sr-only">
        סרטון לולאה במסך מלא: כלב אוכל בעמדת האכלה והרצפה נשארת יבשה לגמרי.
      </span>

      {/* Full-bleed cinematic layer */}
      <div className="absolute inset-0 min-h-[100svh]" aria-hidden>
        {videoSrc ? (
          <video
            className="hero-video-scale absolute inset-0 z-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc || undefined}
            aria-hidden
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-soft via-cream to-sand">
            <ProductIllustration className="relative z-[1] h-full w-full p-8 opacity-90 sm:p-14" />
          </div>
        )}

        {/* Mobile: bottom-weighted scrim so copy at the bottom is sharp */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-ink via-ink/65 to-ink/20 lg:hidden" />
        {/* Desktop: weighted toward the right (copy column in RTL visual reading) */}
        <div
          className="absolute inset-0 z-[1] hidden lg:block"
          style={{
            background: `
              linear-gradient(270deg, rgba(26,23,20,0.94) 0%, rgba(26,23,20,0.45) 40%, rgba(26,23,20,0.08) 60%, transparent 78%),
              linear-gradient(to top, rgba(26,23,20,0.55) 0%, transparent 45%)
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.85] mix-blend-soft-light lg:opacity-[0.55]"
          style={{
            background:
              "radial-gradient(ellipse 100% 70% at 50% 45%, transparent 32%, rgba(26,23,20,0.55) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[3] noise opacity-[0.08]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[88rem] flex-col justify-end px-5 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-20 sm:px-8 sm:pb-14 sm:pt-28 lg:justify-center lg:px-10 lg:pb-16 lg:pt-20 xl:px-12">
        <div
          dir="ltr"
          className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
        >
          <div className="hidden min-h-[12rem] lg:block" aria-hidden />

          <article
            dir="rtl"
            className="hero-rise mx-auto flex w-full max-w-xl flex-col text-start lg:mx-0 lg:max-w-[28rem] xl:max-w-[30rem]"
          >
            <p className="text-sm font-medium text-cream/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
                </span>
                מהדורת השקה ראשונה · כמות מוגבלת
              </span>
            </p>

            <h1
              id="hero-heading"
              className="font-display mt-7 text-[2.125rem] font-medium leading-[1.08] tracking-tight text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] sm:text-[2.5rem] sm:leading-[1.06] md:text-5xl lg:text-[3.15rem] lg:leading-[1.02]"
            >
              סוף לרצפות רטובות ולאוכל מפוזר בכל הבית.
            </h1>

            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-cream/85 sm:text-lg">
              עמדת האכלה מעוצבת שעוצרת התזות, מנקזת מים ושומרת על הרצפה יבשה — גם
              כשהכלב אוכל בתאבון.
            </p>

            <div className="mt-9 flex w-full flex-col gap-3 sm:max-w-[28rem] sm:flex-row sm:items-stretch sm:gap-3">
              <LeadCaptureTrigger className="group inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-cream px-6 text-[15px] font-semibold text-ink shadow-[0_24px_48px_-18px_rgba(0,0,0,0.55)] transition duration-300 hover:bg-white hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.5)] active:scale-[0.99] sm:flex-1">
                <span>שרינו לי 10% הנחה להשקה</span>
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 shrink-0 -translate-x-0 transition-transform duration-300 group-hover:-translate-x-1"
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
                href="#product-features-anatomy"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 text-[15px] font-medium text-cream backdrop-blur-md transition hover:bg-white/15 sm:min-h-[54px] sm:flex-1"
              >
                איך זה עובד
              </a>
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-cream/65">
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-clay" fill="none" aria-hidden>
                  <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                משלוחים לכל הארץ
              </span>
              <span className="text-white/25" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-clay" fill="none" aria-hidden>
                  <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                אחריות מלאה
              </span>
              <span className="text-white/25" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-clay" fill="none" aria-hidden>
                  <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                מענה בוואטסאפ
              </span>
            </p>

            <ul
              className="mt-9 grid gap-2.5 border-t border-white/15 pt-8 text-[13px] text-cream/75 sm:grid-cols-3 sm:gap-x-5 sm:border-t-0 sm:pt-0"
              aria-label="יתרונות מהירים"
            >
              {QUICK_BENEFITS.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-0.5 h-4 w-4 shrink-0 text-clay"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M6 10.5 8.8 13.3 14.5 6.6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      {/* Scroll cue (desktop only) */}
      <a
        href="#product-features-anatomy"
        aria-label="גלילה למידע נוסף"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-cream/55 transition hover:text-cream lg:flex"
      >
        <span>scroll</span>
        <span className="relative block h-8 w-px bg-cream/30 overflow-hidden">
          <span className="hero-scroll-cue absolute inset-x-0 top-0 h-3 bg-cream" />
        </span>
      </a>
    </section>
  );
}
