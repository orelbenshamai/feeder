#!/usr/bin/env bash
# Compress the hero loop + extract a poster frame.
#
# Requires: ffmpeg (brew install ffmpeg)
#
# Usage:
#   ./scripts/compress-hero-video.sh
#   ./scripts/compress-hero-video.sh /path/to/mesudar_main_video.mp4
#
# Outputs next to the source file (or LOCAL_MEDIA_DIR/media):
#   mesudar_main_video_poster.jpg   — instant hero placeholder (~80–150KB)
#   mesudar_main_video_mobile.mp4   — 720p, target ~2–4MB
#   mesudar_main_video_desktop.mp4  — 1080p, target ~5–8MB
#
# Then upload the three files to R2 under /media/ (same folder as other assets).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -f "$ROOT/.env.local" ]]; then
  # shellcheck disable=SC1091
  source <(grep -E '^LOCAL_MEDIA_DIR=' "$ROOT/.env.local" | sed 's/^/export /')
fi

SRC="${1:-${LOCAL_MEDIA_DIR:+$LOCAL_MEDIA_DIR/media/}mesudar_main_video.mp4}"
OUT_DIR="$(dirname "$SRC")"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "❌  ffmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "❌  Source not found: $SRC"
  exit 1
fi

POSTER="$OUT_DIR/mesudar_main_video_poster.jpg"
MOBILE="$OUT_DIR/mesudar_main_video_mobile.mp4"
DESKTOP="$OUT_DIR/mesudar_main_video_desktop.mp4"

echo "📹  Source: $SRC ($(du -h "$SRC" | cut -f1))"
echo ""

echo "→ Poster frame…"
ffmpeg -hide_banner -loglevel error -y \
  -ss 0.5 -i "$SRC" \
  -frames:v 1 -q:v 3 \
  "$POSTER"

echo "→ Mobile (720p)…"
ffmpeg -hide_banner -loglevel error -y -i "$SRC" \
  -vf "scale='min(720,iw)':-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 28 -maxrate 900k -bufsize 1800k \
  -pix_fmt yuv420p -an -movflags +faststart \
  "$MOBILE"

echo "→ Desktop (1080p)…"
ffmpeg -hide_banner -loglevel error -y -i "$SRC" \
  -vf "scale='min(1080,iw)':-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 24 -maxrate 2800k -bufsize 5600k \
  -pix_fmt yuv420p -an -movflags +faststart \
  "$DESKTOP"

echo ""
echo "✅  Done:"
du -h "$POSTER" "$MOBILE" "$DESKTOP" | sed 's/^/   /'
echo ""
echo "Upload to R2: mesudar_main_video_poster.jpg, mesudar_main_video_mobile.mp4, mesudar_main_video_desktop.mp4"
