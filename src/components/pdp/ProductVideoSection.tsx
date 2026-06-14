import type { ProductVideo } from "@/types/product";
import VimeoEmbed from "@/components/VimeoEmbed";

type ProductVideoSectionProps = {
  video: ProductVideo;
  category: string;
};

export default function ProductVideoSection({
  video,
  category,
}: ProductVideoSectionProps) {
  const headingId = "product-video-heading";
  const accessibleTitle = `${category} MESUDAR בפעולה`;

  return (
    <section
      dir="rtl"
      aria-labelledby={headingId}
      className="bg-ink px-5 pb-10 pt-2 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14"
    >
      <h2
        id={headingId}
        className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-snug tracking-tight text-cream"
      >
        {category}{" "}
        <span className="text-clay" style={{ fontFamily: "var(--font-nunito)" }}>
          MESUDAR
        </span>{" "}
        בפעולה
      </h2>
      <div className="mt-6 flex justify-center sm:mt-8">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl ring-1 ring-cream/10 lg:max-w-5xl">
          <VimeoEmbed
            videoId={video.vimeoId}
            title={accessibleTitle}
            className="aspect-video w-full"
          />
        </div>
      </div>
    </section>
  );
}
