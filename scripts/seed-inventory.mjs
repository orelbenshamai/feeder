/**
 * Seed the `inventory` collection in the `mesudar` database.
 * Run with: node scripts/seed-inventory.mjs
 *
 * Reads MONGODB_URI from .env.local automatically.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = resolve(__dir, "..");

// ── Load .env.local manually (no dotenv dependency needed) ──────────────────
const envPath = resolve(root, ".env.local");
const envLines = readFileSync(envPath, "utf8").split("\n");
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌  MONGODB_URI not set in .env.local");
  process.exit(1);
}

// ── Load data ────────────────────────────────────────────────────────────────
const inventory = JSON.parse(readFileSync(resolve(root, "inventory.json"), "utf8"));

// ── Seed ─────────────────────────────────────────────────────────────────────
const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db();

  const invCol = db.collection("inventory");
  let invCount = 0;
  for (const product of inventory) {
    const r = await invCol.replaceOne(
      { productId: product.productId },
      { ...product, updatedAt: new Date() },
      { upsert: true }
    );
    invCount += r.upsertedCount + r.modifiedCount;
    console.log(`✓  ${product.name} (${product.variants.length} variants)`);
  }

  console.log(`\n✅  Done — ${invCount} document(s) written to Mesudar.inventory`);
} finally {
  await client.close();
}
