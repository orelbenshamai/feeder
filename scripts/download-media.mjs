#!/usr/bin/env node
/**
 * Download all media files referenced via media("…") in the codebase.
 *
 * Source URL (same as src/app/media/[...path]/route.ts):
 *   `${R2_SOURCE_URL}/media/${filename}`
 *
 * Usage:
 *   node scripts/download-media.mjs
 *   R2_SOURCE_URL=https://… node scripts/download-media.mjs
 *   node scripts/download-media.mjs --images-only
 *   node scripts/download-media.mjs --force
 *
 * Output (gitignored): scripts/media-local/
 *
 * Loads .env / .env.local from the repo root if present.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(__dirname, "media-local");

const IMAGE_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(REPO_ROOT, name);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(ent.name)) files.push(p);
  }
  return files;
}

const EXPLICIT_EXT = /\.(mp4|png|jpe?g|webp|gif|svg|avif)$/i;

/** Mirror src/lib/media.ts path rules → R2-relative key under /media/… */
function resolveMediaKey(filename) {
  let name = filename.replace(/^avif\//, "");
  if (!EXPLICIT_EXT.test(name)) name = `${name}.avif`;
  return name.endsWith(".avif") ? `avif/${name}` : name;
}

/** Collect unique R2 keys from media("…") / media('…') calls. */
function collectMediaFilenames() {
  const files = walk(path.join(REPO_ROOT, "src"));
  const found = new Set();
  const re = /media\(\s*["']([^"']+)["']\s*\)/g;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(re)) {
      const name = m[1].trim();
      if (name && !name.includes("..") && !name.startsWith("/")) {
        found.add(resolveMediaKey(name));
      }
    }
  }
  return [...found].sort((a, b) => a.localeCompare(b));
}

async function downloadOne(url, dest) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  loadEnvFiles();

  const args = new Set(process.argv.slice(2));
  const imagesOnly = args.has("--images-only");
  const force = args.has("--force");

  const r2Source = (process.env.R2_SOURCE_URL || "").replace(/\/$/, "");
  if (!r2Source) {
    console.error(
      "Missing R2_SOURCE_URL.\n" +
        "Set it in .env / .env.local (same as the Next media proxy) or export it.",
    );
    process.exit(1);
  }

  let names = collectMediaFilenames();
  if (imagesOnly) {
    names = names.filter((n) =>
      IMAGE_EXT.has(path.extname(n).toLowerCase()),
    );
  }

  if (!names.length) {
    console.error("No media(\"…\") references found under src/.");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Source:  ${r2Source}/media/<file>`);
  console.log(`Output:  ${OUT_DIR}`);
  console.log(`Files:   ${names.length}${imagesOnly ? " (images only)" : ""}`);
  console.log("");

  let ok = 0;
  let skipped = 0;
  let failed = 0;
  let totalBytes = 0;

  for (const name of names) {
    const dest = path.join(OUT_DIR, name);
    if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      skipped += 1;
      console.log(`skip  ${name}`);
      continue;
    }

    const url = `${r2Source}/media/${name}`;
    try {
      const bytes = await downloadOne(url, dest);
      totalBytes += bytes;
      ok += 1;
      console.log(`ok    ${name}  (${formatBytes(bytes)})`);
    } catch (err) {
      failed += 1;
      console.error(`FAIL  ${name}  — ${err.message}`);
    }
  }

  console.log("");
  console.log("── summary ──");
  console.log(`downloaded: ${ok}`);
  console.log(`skipped:    ${skipped}`);
  console.log(`failed:     ${failed}`);
  console.log(`bytes:      ${formatBytes(totalBytes)}`);
  console.log(`dir:        ${OUT_DIR}`);

  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
