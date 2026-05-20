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
        relative isolate overflow-x-clip
        flex min-h-[100svh] flex-col bg-soft
        lg:block lg:bg-transparent lg:relative
      "
      aria-labelledby="hero-heading"
      aria-describedby="hero-visual-desc"
    >
      <span id="hero-visual-desc" className="sr-only">
        סרטון לולאה: כלב אוכל בעמדת האכלה והרצפה נשארת יבשה לגמרי.
      </span>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/logo.png"
          alt="מסודר"
          className="pointer-events-none block h-20 w-auto select-none brightness-0 invert sm:h-24 lg:h-28 xl:h-32"
          draggable={false}
        />
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
            className="hero-rise mx-auto flex w-full max-w-xl flex-col overflow-visible text-start lg:mx-0 lg:max-w-[34rem]"
          >

            <h1
              id="hero-heading"
              className="
                font-display font-black tracking-tight
                text-4xl leading-[1.2] text-ink
                sm:text-5xl sm:leading-[1.18]
                lg:text-6xl lg:leading-[1.15] lg:text-cream
                lg:[text-shadow:0_2px_6px_rgba(0,0,0,0.5),0_10px_32px_rgba(0,0,0,0.38)]
              "
            >
              כי נמאס לנקות את הרצפה שלוש פעמים ביום, ובואו נודה באמת —
              <br />
              הם לא הולכים ללמוד לאכול בנימוס
            </h1>

            {/* Hidden on mobile to keep the screen clean — visible from md up */}
            <p className="hidden md:block mt-5 max-w-md text-base leading-relaxed text-stone/80 sm:text-lg lg:text-cream/80 lg:[text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
              עמדת האכלה חכמה שקולטת את כל השאריות וההתזות עוד לפני שהן מגיעות לרצפה שלכם
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:max-w-[30rem] sm:flex-row sm:items-stretch sm:gap-3">
              <LeadCaptureTrigger
                className="
                  group inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold
                  transition duration-300 active:scale-[0.99] sm:flex-1
                  bg-ink text-cream shadow-[0_20px_48px_-18px_rgba(26,23,20,0.5)] hover:bg-ink/90
                  lg:bg-cream lg:text-ink lg:shadow-[0_24px_48px_-18px_rgba(0,0,0,0.55)] lg:hover:bg-white lg:hover:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.5)]
                "
              >
                <span>שריינו לי 10 אחוז הנחה</span>
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
                href="#product-introduction"
                className="
                  inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 text-[15px] font-medium transition
                  sm:min-h-[54px] sm:flex-1
                  border border-line/80 bg-soft/60 text-ink hover:bg-soft
                  lg:border-white/35 lg:bg-white/10 lg:text-cream lg:backdrop-blur-md lg:hover:bg-white/15
                "
              >
                הכירו את מסודר ↓
              </a>
            </div>
          </article>
        </div>
      </div>

    </section>
  );
}
