import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const r2Source = process.env.R2_SOURCE_URL;
  if (!r2Source) {
    return new NextResponse(null, { status: 404 });
  }

  const filename = segments.join("/");
  if (!filename || filename.includes("..")) {
    return new NextResponse(null, { status: 400 });
  }

  const r2Url = `${r2Source.replace(/\/$/, "")}/media/${filename}`;

  let upstream: Response;
  try {
    upstream = await fetch(r2Url, {
      headers: { Range: req.headers.get("range") ?? "" },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new NextResponse(null, { status: upstream.status });
  }

  const headers = new Headers();
  for (const key of [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
  ]) {
    const val = upstream.headers.get(key);
    if (val) headers.set(key, val);
  }
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
