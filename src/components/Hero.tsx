import { media } from "@/lib/media";
import ProductIllustration from "./ProductIllustration";
import HeroAutoplayVideo from "./HeroAutoplayVideo";
import GhostCTAButton from "./GhostCTAButton";
/** Hero video URL from CDN via `media()` (mp4 cannot be bundled by Turbopack). */
const DEFAULT_HERO_VIDEO = media("mesudar_main_video.mp4");

const HERO_SCRIM =
  "linear-gradient(to top, rgba(31,58,82,0.92) 0%, rgba(31,58,82,0.62) 32%, rgba(31,58,82,0.18) 62%, transparent 78%)";

function HeroCopy({ headingId }: { headingId?: string }) {
  return (
    <div className="mx-auto w-full max-w-7xl md:mx-0 md:me-auto" dir="rtl">
      <article className="hero-rise hero-copy-panel">
        <div className="min-w-0">
          <h1
            {...(headingId ? { id: headingId } : {})}
            className="hero-title flex flex-col items-center gap-1 text-center"
          >
            <span className="text-[0.7em] font-light tracking-[0.15em] text-cream/80 uppercase">תשמרו על הבית שלכם</span>
            <span className="text-[1.6em] font-black tracking-[0.25em] text-clay leading-none" style={{ fontFamily: "var(--font-nunito)" }}>MESUDAR</span>
            <span className="text-[0.7em] font-light tracking-[0.15em] text-cream/80 uppercase">לאחר כל ארוחה</span>
          </h1>
        </div>
        <GhostCTAButton className="mx-auto mt-8" />
      </article>
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
      className="isolate h-[calc(100svh-var(--site-header-h))] max-h-[calc(100svh-var(--site-header-h))] overflow-hidden max-md:h-[calc(var(--ios-vh)-var(--site-header-h))] max-md:max-h-[calc(var(--ios-vh)-var(--site-header-h))]"
      aria-labelledby="hero-heading"
      aria-describedby="hero-visual-desc"
    >
      <span id="hero-visual-desc" className="sr-only">
        סרטון לולאה: כלב אוכל בעמדת ההאכלה והרצפה נשארת יבשה לגמרי.
      </span>

      {/* ── PHONE — video band + copy panel ─────────────────────────────── */}
      <div className="grid h-full grid-rows-[minmax(0,52svh)_1fr] overflow-hidden bg-ink md:hidden">
        <div className="relative overflow-hidden">
          <HeroMedia
            videoSrc={mobileVideoSrc}
            posterSrc={mobilePosterSrc}
            objectFit="cover"
            objectPosition="object-[center_38%]"
            className="absolute inset-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-ink via-ink/85 to-transparent"
          />
        </div>

        <div className="relative z-10 grid h-full place-items-center bg-ink px-5 sm:px-8" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))", paddingTop: "2rem" }}>
          <HeroCopy headingId="hero-heading" />
        </div>
      </div>

      {/* ── TABLET + DESKTOP — full-bleed video with bottom overlay ───── */}
      <div className="relative isolate hidden h-full overflow-hidden bg-ink md:block">
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

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 pt-16 sm:px-8 sm:pb-12 md:px-10 md:pb-14 lg:px-12 lg:pb-16 xl:px-16 xl:pb-20">
          <HeroCopy headingId="hero-heading" />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-ink))" }}
        />
      </div>
    </section>
  );
}
