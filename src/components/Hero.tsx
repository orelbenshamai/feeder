import ProductIllustration from "./ProductIllustration";
import HeroAutoplayVideo from "./HeroAutoplayVideo";
import { LeadCaptureTrigger } from "./LeadCapture";

/** Served from `public/media/` (Turbopack cannot bundle `.mp4` imports). */
const DEFAULT_HERO_VIDEO = "/media/ad1.mp4";

const HERO_SCRIM =
  "linear-gradient(to top, rgba(31,58,82,0.72) 0%, rgba(31,58,82,0.28) 28%, transparent 58%)";

function HeroCopy({ headingId }: { headingId?: string }) {
  return (
    <div className="mx-auto w-full max-w-7xl" dir="rtl">
      <article className="hero-rise flex min-h-0 flex-col gap-3 max-lg:gap-3.5 lg:flex-row lg:items-end lg:justify-between lg:gap-8 xl:gap-16">
        <div className="min-w-0 max-w-2xl">
          <h1
            {...(headingId ? { id: headingId } : {})}
            className="
              font-display font-medium tracking-tight text-cream
              text-center lg:text-start
              text-[clamp(1.75rem,6.8vw,2.25rem)] leading-[1.1]
              lg:text-[clamp(2.35rem,3.4vw,3.85rem)] lg:leading-[1.06]
              [text-shadow:0_2px_16px_rgba(0,0,0,0.35)]
            "
          >
            <span className="lg:hidden">
              כי נמאס לנקות
              <br />
              את הרצפה
              <br />
              <span className="text-cream/95">שלוש פעמים ביום</span>
            </span>
            <span className="hidden lg:inline">
              כי נמאס לנקות את הרצפה{" "}
              <span className="text-cream/95">שלוש פעמים ביום</span>
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[14px] font-medium leading-[1.55] tracking-[0.02em] text-cream/80 sm:mt-3.5 sm:text-[15px] lg:mt-4 lg:text-[16px] lg:leading-[1.65] lg:tracking-[0.03em]">
            <span className="lg:hidden">
              עמדת האכלה חכמה שקולטת
              <br />
              את כל השאריות וההתזות
              <br />
              <span className="text-cream/65">רצפה יבשה, בלי בלגן</span>
            </span>
            <span className="hidden lg:inline">
              עמדת האכלה חכמה שקולטת את כל השאריות וההתזות —{" "}
              <span className="text-cream/65">רצפה יבשה, בלי בלגן</span>
            </span>
          </p>
        </div>

        <LeadCaptureTrigger
          className="
            group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-7
            min-h-[48px] text-[12px] font-semibold uppercase tracking-[0.08em]
            transition duration-300 active:scale-[0.99]
            max-lg:mt-0.5
            sm:w-auto sm:min-h-[52px] sm:px-8 sm:text-[13px]
            bg-clay text-ink shadow-[0_12px_32px_-12px_rgba(255,159,10,0.55)] hover:bg-clay/90
          "
        >
          <span>שריינו לי 10% הנחה</span>
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
      </article>
    </div>
  );
}

function HeroBrandMark({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center ${className ?? ""}`}
    >
      <span
        className="font-[family-name:var(--font-nunito)] text-lg font-extrabold tracking-[0.06em] text-cream/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)] sm:text-xl"
        aria-label="מסודר"
      >
        MESUDAR
      </span>
    </div>
  );
}

function HeroMedia({
  videoSrc,
  posterSrc,
  objectPosition,
  objectFit = "cover",
  className,
}: {
  videoSrc: string;
  posterSrc?: string;
  objectPosition: string;
  objectFit?: "cover" | "contain";
  className?: string;
}) {
  if (videoSrc) {
    return (
      <HeroAutoplayVideo
        src={videoSrc}
        poster={posterSrc}
        className={`h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"} ${objectPosition} ${className ?? ""}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-ink via-stone to-sand/40 ${className ?? ""}`}
    >
      <ProductIllustration className="h-full w-full p-8 opacity-90 sm:p-14" />
    </div>
  );
}

export default function Hero() {
  const envSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  const envMobileSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL?.trim();
  const desktopVideoSrc = envSrc || DEFAULT_HERO_VIDEO;
  const mobileVideoSrc = envMobileSrc || desktopVideoSrc;
  const desktopPosterSrc =
    process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER_URL?.trim() || undefined;
  const mobilePosterSrc =
    process.env.NEXT_PUBLIC_HERO_VIDEO_MOBILE_POSTER_URL?.trim() ||
    desktopPosterSrc;

  return (
    <section
      id="hero"
      className="isolate h-[100svh] max-h-[100svh] overflow-hidden max-lg:h-[var(--app-vh,100svh)] max-lg:max-h-[var(--app-vh,100svh)]"
      aria-labelledby="hero-heading"
      aria-describedby="hero-visual-desc"
    >
      <span id="hero-visual-desc" className="sr-only">
        סרטון לולאה: כלב אוכל בעמדת האכלה והרצפה נשארת יבשה לגמרי.
      </span>

      {/* ── MOBILE — video band + copy below (no full-screen crop) ─────── */}
      <div className="grid h-full grid-rows-[57fr_43fr] overflow-hidden bg-ink lg:hidden">
        <div className="relative min-h-0 overflow-hidden">
          <HeroMedia
            videoSrc={mobileVideoSrc}
            posterSrc={mobilePosterSrc}
            objectFit="cover"
            objectPosition="object-[center_38%]"
            className="absolute inset-0"
          />
          <HeroBrandMark className="pt-[max(env(safe-area-inset-top),0.875rem)]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-ink via-ink/80 to-transparent"
          />
        </div>

        <div className="relative z-10 flex min-h-0 flex-col justify-center overflow-hidden bg-ink px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 sm:px-8">
          <HeroCopy headingId="hero-heading" />
        </div>
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────────────── */}
      <div className="relative isolate hidden h-full overflow-hidden bg-ink lg:block">
        <div className="absolute inset-0 z-0">
          <HeroMedia
            videoSrc={desktopVideoSrc}
            posterSrc={desktopPosterSrc}
            objectPosition="object-[center_50%]"
            className="absolute inset-0"
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: HERO_SCRIM }}
        />

        <HeroBrandMark className="pt-8" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-10 pb-12 xl:px-16 xl:pb-14">
          <HeroCopy />
        </div>
      </div>
    </section>
  );
}
