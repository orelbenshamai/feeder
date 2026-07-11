import { media } from "@/lib/media";
import HeroVideos from "./HeroVideos";
import GhostCTAButton from "./GhostCTAButton";

const HERO_VIDEO_MOBILE = media("media_mesudar_main_video_compressed_mobile.mp4");
const HERO_VIDEO_DESKTOP = media("media_mesudar_main_video_compressed_desktop.mp4");
const HERO_POSTER_MOBILE = media("mesudar_main_video_poster_mobile.png");
const HERO_POSTER_DESKTOP = media("mesudar_main_video_poster_desktop.png");

const HERO_SCRIM =
  "linear-gradient(to top, rgba(31,58,82,0.92) 0%, rgba(31,58,82,0.62) 32%, rgba(31,58,82,0.18) 62%, transparent 78%)";

const HERO_SCRIM_MOBILE =
  "linear-gradient(to top, rgba(31,58,82,0.94) 0%, rgba(31,58,82,0.55) 55%, transparent 100%)";

function HeroCopy({
  headingId,
  mobile = false,
}: {
  headingId?: string;
  mobile?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl md:mx-0 md:me-auto" dir="rtl">
      <article
        className={`hero-rise hero-copy-panel${mobile ? " hero-copy-panel--mobile" : ""}`}
      >
        <div className="min-w-0">
          <h1
            {...(headingId ? { id: headingId } : {})}
            className={`hero-title${mobile ? " hero-title--mobile" : ""} flex flex-col items-center gap-1 text-center`}
          >
            <span
              className={`text-[0.7em] font-light uppercase text-cream/80 ${mobile ? "tracking-[0.14em]" : "tracking-[0.15em]"}`}
            >
              תשמרו על הבית שלכם
            </span>
            <span
              className={`text-[1.6em] font-black text-clay leading-none ${mobile ? "tracking-[0.22em]" : "tracking-[0.25em]"}`}
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              MESUDAR
            </span>
            <span
              className={`text-[0.7em] font-light uppercase text-cream/80 ${mobile ? "tracking-[0.14em]" : "tracking-[0.15em]"}`}
            >
              לאחר כל ארוחה
            </span>
          </h1>
        </div>
        <GhostCTAButton className={`mx-auto ${mobile ? "mt-5" : "mt-8"}`} />
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

      <HeroVideos
        mobileSrc={HERO_VIDEO_MOBILE}
        desktopSrc={HERO_VIDEO_DESKTOP}
        mobilePoster={HERO_POSTER_MOBILE}
        desktopPoster={HERO_POSTER_DESKTOP}
      />

      {/* ── PHONE — full-bleed 9:16 video with compact copy at bottom ─── */}
      <div className="relative z-10 flex h-full flex-col justify-end md:hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
          style={{ background: HERO_SCRIM_MOBILE }}
        />
        <div className="relative px-4 pb-5 sm:px-6 sm:pb-6">
          <HeroCopy headingId="hero-heading" mobile />
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
