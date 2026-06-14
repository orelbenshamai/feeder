import { getVimeoEmbedSrc } from "@/lib/vimeo";

type VimeoEmbedProps = {
  videoId: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
};

export default function VimeoEmbed({
  videoId,
  title = "סרטון Vimeo",
  className = "",
  autoplay = false,
}: VimeoEmbedProps) {
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      <iframe
        src={getVimeoEmbedSrc(videoId, { autoplay })}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
