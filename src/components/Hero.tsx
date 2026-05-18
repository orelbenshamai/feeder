import ProductIllustration from "./ProductIllustration";
import HeroAutoplayVideo from "./HeroAutoplayVideo";
import { LeadCaptureTrigger } from "./LeadCapture";

/** Served from `public/media/ad1.mp4` (Turbopack cannot bundle `.mp4` imports). */
const DEFAULT_HERO_VIDEO = "/media/ad1.mp4";

export default function Hero() {
  const envSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  const videoSrc = envSrc || DEFAULT_HERO_VIDEO;
  const posterSrc =
    process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER_URL?.trim() || undefined;

  return (
    <section
      id="hero"
      className="
        relative isolate overflow-hidden
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
        <span
          className="relative inline-flex select-none items-center justify-center"
          aria-label="מסודר"
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
              pointer-events-none block h-20 w-auto
              brightness-0 invert
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]
              drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]
              sm:h-24 lg:h-28 xl:h-32
            "
            draggable={false}
          />
        </span>
      </header>

      {/* ── MOBILE VIDEO ───────────────────────────────────────────────────
          Edge-to-edge, flat-bottom. Footage dissolves into the cream copy
          area beneath it with a tall fade — no border, no rounded card,
          no separate shadow blob. One continuous wash. */}
      <div className="relative shrink-0 bg-soft lg:hidden">
        <div
          className="relative w-full overflow-hidden bg-soft"
          style={{ height: "min(100vw, 78svh)" }}
        >
          {videoSrc ? (
            <HeroAutoplayVideo
              src={videoSrc}
              poster={posterSrc}
              className="absolute inset-0 h-full w-full object-cover object-[center_56%]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-soft to-sand/60">
              <ProductIllustration className="h-full w-full p-10 opacity-90" />
            </div>
          )}
          {/* Short, subtle dissolve at the very bottom edge — kills the
              hard line where the video meets the copy area without
              washing out the footage. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
            style={{
              background:
                "linear-gradient(to top, #f4efe6 0%, rgba(244,239,230,0.55) 55%, rgba(244,239,230,0) 100%)",
            }}
          />
        </div>
      </div>

      {/* ── DESKTOP FULL-BLEED BACKDROP ───────────────────────────────── */}
      {/* Hidden on mobile. On lg+ it becomes the cinematic background. */}
      <div
        className="hidden lg:block absolute inset-0 min-h-[100svh]"
        aria-hidden
      >
        {videoSrc ? (
          <HeroAutoplayVideo
            src={videoSrc}
            poster={posterSrc}
            className="hero-video-scale absolute inset-0 z-0 h-full w-full object-cover object-[center_54%]"
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
                href="#product-breakdown"
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
          </article>
        </div>
      </div>

    </section>
  );
}
