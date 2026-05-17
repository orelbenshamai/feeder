import ProductIllustration from "./ProductIllustration";
import { LeadCaptureTrigger } from "./LeadCapture";

/** Served from `public/media/ad1.mp4` (Turbopack cannot bundle `.mp4` imports). */
const DEFAULT_HERO_VIDEO = "/media/ad1.mp4";

const QUICK_BENEFITS = [
  "רצפה יבשה אחרי כל ארוחה",
  "קערות נירוסטה — מתאים למדיח",
  "יציב על כל ריצוף · לא זז, לא שורט",
];

function VideoEl({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      width={1920}
      height={1080}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden
    >
      {/* H.264 baseline for broadest iOS/Android codec support */}
      <source src={src} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      <source src={src} type="video/mp4" />
    </video>
  );
}

export default function Hero() {
  const envSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  const videoSrc = envSrc || DEFAULT_HERO_VIDEO;
  const posterSrc =
    process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER_URL?.trim() || undefined;

  return (
    <section
      id="hero"
      className="
        isolate overflow-hidden
        flex min-h-[100svh] flex-col bg-soft
        lg:block lg:bg-transparent lg:relative
      "
      aria-labelledby="hero-heading"
      aria-describedby="hero-visual-desc"
    >
      <span id="hero-visual-desc" className="sr-only">
        סרטון לולאה: כלב אוכל בעמדת האכלה והרצפה נשארת יבשה לגמרי.
      </span>

      {/* ── HEADER ──────────────────────────────────────────────────────
            Semantic, fully-transparent <header>. No top bar / block —
            the video flows behind it edge-to-edge. A soft radial
            vignette behind the logo (only) lifts contrast without
            introducing a visible header surface. ───────────────────── */}
      <header
        role="banner"
        dir="rtl"
        className="
          absolute inset-x-0 top-0 z-30
          flex items-center justify-center
          px-5 pb-3 pt-[max(env(safe-area-inset-top),0.5rem)]
          sm:pb-4 sm:pt-[max(env(safe-area-inset-top),0.75rem)]
          lg:pt-6
        "
      >
        <a
          href="#"
          aria-label="מסודר — חזרה לראש הדף"
          className="
            relative inline-flex items-center justify-center
            transition-opacity duration-200 hover:opacity-95
          "
        >
          {/* Radial vignette — softly fades the video behind the mark
              so it never reads as a hard 'header bar'. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-12 -inset-y-6 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 65% 70% at 50% 50%, rgba(26,23,20,0.45) 0%, rgba(26,23,20,0.18) 45%, transparent 75%)",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/logo.png"
            alt="מסודר"
            className="
              block h-20 w-auto
              brightness-0 invert
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]
              drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]
              sm:h-24 lg:h-28 xl:h-32
            "
            draggable={false}
          />
        </a>
      </header>

      {/* ── MOBILE VIDEO — full-bleed, natural aspect, no crop ──────────── */}
      {/*
        Edge-to-edge hero. Slightly taller than 16:9 (3:2) so the clip reads
        bigger on phones; landscape footage fills height and trims the sides.
      */}
      <div className="shrink-0 lg:hidden">
        <div className="relative w-full bg-ink" aria-hidden>
          {/* Taller than 16:9: letterboxes sides on landscape footage, not top/bottom */}
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            {videoSrc ? (
              <VideoEl
                src={videoSrc}
                poster={posterSrc}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-soft to-sand/60">
                <ProductIllustration className="h-full w-full p-10 opacity-90" />
              </div>
            )}

            {/* Bottom fade — dissolves into the warm bg of the strip below */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-warm to-transparent" />
          </div>
        </div>

        {/* Scarcity line — below video on mobile so footage stays unobstructed.
            Uses the same warm tone as the breakdown section for one continuous surface. */}
        <div className="flex justify-center bg-warm px-4 pb-1 pt-3" dir="rtl">
          <p className="m-0 flex items-center gap-2 rounded-full border border-line/80 bg-cream/95 px-3 py-1.5 text-[11px] font-medium text-ink shadow-[0_4px_18px_-10px_rgba(26,23,20,0.2)] ring-1 ring-black/[0.04]">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
            </span>
            מהדורת השקה ראשונה · כמות מוגבלת
          </p>
        </div>
      </div>

      {/* ── DESKTOP FULL-BLEED BACKDROP ───────────────────────────────── */}
      {/* Hidden on mobile. On lg+ it becomes the cinematic background. */}
      <div
        className="hidden lg:block absolute inset-0 min-h-[100svh]"
        aria-hidden
      >
        {videoSrc ? (
          <VideoEl
            src={videoSrc}
            poster={posterSrc}
            className="hero-video-scale absolute inset-0 z-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-soft via-cream to-sand">
            <ProductIllustration className="relative z-[1] h-full w-full p-14 opacity-90" />
          </div>
        )}

        {/* Scrims: darken toward the right column where copy sits */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `
              linear-gradient(270deg, rgba(26,23,20,0.94) 0%, rgba(26,23,20,0.45) 40%, rgba(26,23,20,0.08) 60%, transparent 78%),
              linear-gradient(to top, rgba(26,23,20,0.55) 0%, transparent 45%)
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.55] mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(ellipse 100% 70% at 50% 45%, transparent 32%, rgba(26,23,20,0.55) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[3] noise opacity-[0.08]" />
      </div>

      {/* ── COPY ──────────────────────────────────────────────────────── */}
      {/*
        Mobile:  flex-1, sits below the card, bg-soft, dark text.
        Desktop: absolute overlay, sits over the full-bleed video, light text.
        The text colour tokens swap via lg: variants.
      */}
      <div
        className="
          relative z-10 flex-1
          px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-8
          sm:px-8 sm:pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pt-10
          lg:absolute lg:inset-0 lg:flex lg:min-h-[100svh] lg:items-center
          lg:px-10 lg:pb-16 lg:pt-20 xl:px-12
        "
      >
        <div
          dir="ltr"
          className="grid w-full grid-cols-1 gap-10 lg:mx-auto lg:max-w-[88rem] lg:grid-cols-2 lg:items-center lg:gap-16"
        >
          {/* Left spacer on desktop (the video fills that visual area) */}
          <div className="hidden min-h-[12rem] lg:block" aria-hidden />

          <article
            dir="rtl"
            className="hero-rise mx-auto flex w-full max-w-xl flex-col text-start lg:mx-0 lg:max-w-[28rem] xl:max-w-[30rem]"
          >
            {/* Badge — desktop only (mobile badge is pinned to the video card above) */}
            <p className="hidden lg:block text-sm font-medium text-cream/80">
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
              className="
                font-display font-medium tracking-tight leading-[1.08]
                text-[2rem] text-ink
                mt-0 lg:mt-7
                sm:text-[2.25rem] sm:leading-[1.07]
                md:text-[2.6rem]
                lg:text-[3.15rem] lg:leading-[1.02] lg:text-cream
                lg:[text-shadow:0_2px_4px_rgba(0,0,0,0.45),0_8px_28px_rgba(0,0,0,0.35)]
              "
            >
              סוף לרצפות רטובות ולאוכל מפוזר בכל הבית.
            </h1>

            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/75 sm:text-[17px] lg:text-cream/85 lg:text-lg lg:[text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
              עמדת האכלה מעוצבת שעוצרת התזות, מנקזת מים ושומרת על הרצפה יבשה —
              גם כשהכלב אוכל בתאבון.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:max-w-[28rem] sm:flex-row sm:items-stretch sm:gap-3">
              <LeadCaptureTrigger
                className="
                  group inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold
                  transition duration-300 active:scale-[0.99] sm:flex-1
                  bg-ink text-cream shadow-[0_20px_48px_-18px_rgba(26,23,20,0.5)] hover:bg-ink/90
                  lg:bg-cream lg:text-ink lg:shadow-[0_24px_48px_-18px_rgba(0,0,0,0.55)] lg:hover:bg-white lg:hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.5)]
                "
              >
                <span>שרינו לי 10% הנחה להשקה</span>
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
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
                className="
                  inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 text-[15px] font-medium transition
                  sm:min-h-[54px] sm:flex-1
                  border border-line/80 bg-soft/60 text-ink hover:bg-soft
                  lg:border-white/35 lg:bg-white/10 lg:text-cream lg:backdrop-blur-md lg:hover:bg-white/15
                "
              >
                איך זה עובד
              </a>
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink/65 lg:text-cream/65">
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-clay" fill="none" aria-hidden>
                  <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                משלוחים לכל הארץ
              </span>
              <span className="text-stone/30 lg:text-white/25" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-clay" fill="none" aria-hidden>
                  <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                אחריות מלאה
              </span>
              <span className="text-stone/30 lg:text-white/25" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-clay" fill="none" aria-hidden>
                  <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                מענה בוואטסאפ
              </span>
            </p>

            <ul
              className="
                mt-8 grid gap-2.5 border-t pt-8 text-[13px]
                border-line/60 text-ink/75
                sm:grid-cols-3 sm:gap-x-5
                lg:border-white/15 lg:text-cream/75
              "
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

      {/* Scroll cue — desktop only */}
      <a
        href="#product-features-anatomy"
        aria-label="גלילה למידע נוסף"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-cream/55 transition hover:text-cream lg:flex"
      >
        <span>scroll</span>
        <span className="relative block h-8 w-px overflow-hidden bg-cream/30">
          <span className="hero-scroll-cue absolute inset-x-0 top-0 h-3 bg-cream" />
        </span>
      </a>
    </section>
  );
}
