import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (process.env.NODE_ENV !== "development" || !LOCAL_MEDIA_DIR) {
    return new NextResponse(null, { status: 404 });
  }

  const { path: segments } = await params;
  const filename = segments.join("/");

  if (!filename || filename.includes("..")) {
    return new NextResponse(null, { status: 400 });
  }

  const candidates = [
    path.join(LOCAL_MEDIA_DIR, "media", filename),
    path.join(LOCAL_MEDIA_DIR, filename),
  ];

  for (const candidate of candidates) {
    if (!isInsideRoot(candidate, LOCAL_MEDIA_DIR)) continue;

    try {
      const stat = await fs.stat(candidate);
      if (!stat.isFile()) continue;

      const body = await fs.readFile(candidate);
      const ext = path.extname(candidate).toLowerCase();

      return new NextResponse(body, {
        headers: {
          "Content-Type": MIME[ext] ?? "application/octet-stream",
          "Cache-Control": "no-store",
        },
      });
    } catch {
      // try next candidate
    }
  }

  return new NextResponse(null, { status: 404 });
}
