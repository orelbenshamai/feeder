import { media } from "@/lib/media";
import HeroAutoplayVideo from "./HeroAutoplayVideo";
import GhostCTAButton from "./GhostCTAButton";

const HERO_VIDEO_MOBILE = media("media_mesudar_main_video_compressed_mobile.mp4");
const HERO_VIDEO_DESKTOP = media("media_mesudar_main_video_compressed_desktop.mp4");
const HERO_POSTER_MOBILE = media("mesudar_main_video_poster_mobile.png");
const HERO_POSTER_DESKTOP = media("mesudar_main_video_poster_desktop.png");

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

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate h-below-header max-h-below-header overflow-hidden bg-ink"
      aria-labelledby="hero-heading"
      aria-describedby="hero-visual-desc"
    >
      <span id="hero-visual-desc" className="sr-only">
        סרטון לולאה: כלב אוכל בעמדת ההאכלה והרצפה נשארת יבשה לגמרי.
      </span>

      <HeroAutoplayVideo
        src={HERO_VIDEO_MOBILE}
        poster={HERO_POSTER_MOBILE}
        className="absolute inset-x-0 top-0 z-0 h-[calc(var(--screen-h)*0.52)] w-full object-cover object-[center_38%] md:hidden"
      />
      <HeroAutoplayVideo
        src={HERO_VIDEO_DESKTOP}
        poster={HERO_POSTER_DESKTOP}
        className="absolute inset-0 z-0 hidden h-full w-full object-cover object-[center_50%] md:block"
      />

      {/* ── PHONE — copy panel below video band ─────────────────────────── */}
      <div className="relative z-10 grid h-full grid-rows-[minmax(0,calc(var(--screen-h)*0.52))_1fr] overflow-hidden md:hidden">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-ink via-ink/85 to-transparent"
          />
        </div>
        <div className="grid h-full place-items-center bg-ink px-5 pt-8 pb-8 sm:px-8">
          <HeroCopy headingId="hero-heading" />
        </div>
      </div>

      {/* ── TABLET + DESKTOP — copy overlaid on video ─────────────────── */}
      <div className="relative z-10 hidden h-full md:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: HERO_SCRIM }}
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 pt-16 sm:px-8 sm:pb-12 md:px-10 md:pb-14 lg:px-12 lg:pb-16 xl:px-16 xl:pb-20">
          <HeroCopy headingId="hero-heading" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-ink))" }}
        />
      </div>
    </section>
  );
}
