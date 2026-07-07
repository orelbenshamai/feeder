import fs from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

const LOCAL_MEDIA_DIR = process.env.LOCAL_MEDIA_DIR;

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml",
};

function isInsideRoot(filePath: string, root: string): boolean {
  const resolved = path.resolve(filePath);
  const resolvedRoot = path.resolve(root);
  return (
    resolved === resolvedRoot ||
    resolved.startsWith(`${resolvedRoot}${path.sep}`)
  );
}

async function resolveLocalFile(
  segments: string[],
): Promise<{ filePath: string; stat: Awaited<ReturnType<typeof fs.stat>> } | null> {
  const filename = segments.join("/");

  if (!filename || filename.includes("..")) {
    return null;
  }

  const candidates = [
    path.join(LOCAL_MEDIA_DIR!, "media", filename),
    path.join(LOCAL_MEDIA_DIR!, filename),
  ];

  for (const candidate of candidates) {
    if (!isInsideRoot(candidate, LOCAL_MEDIA_DIR!)) continue;

    try {
      const stat = await fs.stat(candidate);
      if (!stat.isFile()) continue;
      return { filePath: candidate, stat };
    } catch {
      // try next candidate
    }
  }

  return null;
}

function parseRange(
  rangeHeader: string | null,
  size: number,
): { start: number; end: number } | "invalid" | null {
  if (!rangeHeader) return null;

  const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader.trim());
  if (!match) return "invalid";

  const [, startStr, endStr] = match;
  let start = startStr ? Number.parseInt(startStr, 10) : 0;
  let end = endStr ? Number.parseInt(endStr, 10) : size - 1;

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start < 0 ||
    end >= size ||
    start > end
  ) {
    return "invalid";
  }

  if (!startStr && endStr) {
    const suffixLength = end;
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  }

  return { start, end };
}

function streamToWeb(stream: Readable): ReadableStream<Uint8Array> {
  return Readable.toWeb(stream) as ReadableStream<Uint8Array>;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // ── Production: proxy from R2 ─────────────────────────────────────────────
  // R2_SOURCE_URL is server-only (no NEXT_PUBLIC_ prefix) to avoid self-loops.
  const r2Source = process.env.R2_SOURCE_URL;
  if (r2Source) {
    const filename = segments.join("/");
    if (!filename || filename.includes("..")) {
      return new NextResponse(null, { status: 400 });
    }
    const r2Url = `${r2Source.replace(/\/$/, "")}/media/${filename}`;
    const upstream = await fetch(r2Url, {
      headers: { Range: req.headers.get("range") ?? "" },
    });
    if (!upstream.ok && upstream.status !== 206) {
      return new NextResponse(null, { status: upstream.status });
    }
    const headers = new Headers();
    for (const key of ["content-type", "content-length", "content-range", "accept-ranges", "etag", "last-modified"]) {
      const val = upstream.headers.get(key);
      if (val) headers.set(key, val);
    }
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return new NextResponse(upstream.body, { status: upstream.status, headers });
  }

  // ── Development: serve from LOCAL_MEDIA_DIR ───────────────────────────────
  if (process.env.NODE_ENV !== "development" || !LOCAL_MEDIA_DIR) {
    return new NextResponse(null, { status: 404 });
  }

  const resolved = await resolveLocalFile(segments);

  if (!resolved) {
    if (segments.join("/").includes("..")) {
      return new NextResponse(null, { status: 400 });
    }
    return new NextResponse(null, { status: 404 });
  }

  const { filePath, stat } = resolved;
  const size = Number(stat.size);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const range = parseRange(req.headers.get("range"), size);

  if (range === "invalid") {
    return new NextResponse(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  if (range) {
    const { start, end } = range;
    const length = end - start + 1;
    const stream = createReadStream(filePath, { start, end });

    return new NextResponse(streamToWeb(stream), {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(length),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
      },
    });
  }

  const stream = createReadStream(filePath);

  return new NextResponse(streamToWeb(stream), {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store",
    },
  });
}
