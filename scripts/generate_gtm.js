#!/usr/bin/env node
/**
 * generate_gtm.js
 *
 * Builds a *merge-safe* GTM import from:
 *   - scripts/tracking_manifest.json  (events + data layer keys)
 *   - scripts/seed.json               (workspace export — use a FRESH one)
 *
 * Creates (idempotent by name / event):
 *   A. DLV - [key]        Data Layer Variables (missing only)
 *   B. Event - [event]    Custom Event triggers (missing only)
 *   C. GA4 - [event]      GA4 Event tags
 *      Meta - [event]      Meta Pixel Custom HTML tags
 *
 * Output is a DELTA file: only NEW variables / triggers / tags.
 * It does NOT re-export existing tags or customTemplate (those make
 * Merge confirm fail with "unknown error" / Meta Pixel Modified).
 *
 * Usage:
 *   1. GTM → Export Container → save as scripts/seed.json
 *   2. node scripts/generate_gtm.js
 *   3. GTM → Import → updated_container.json → Merge → Preview → Confirm
 *      Preview should show Added only (0 Modified preferred).
 */

const fs = require("fs");
const path = require("path");

const SCRIPT_DIR = __dirname;

const DEFAULT_SEED = path.join(SCRIPT_DIR, "seed.json");
const DEFAULT_MANIFEST = path.join(SCRIPT_DIR, "tracking_manifest.json");
const DEFAULT_OUT = path.join(SCRIPT_DIR, "updated_container.json");

/** Meta standard events → fbq('track', …). Everything else uses trackCustom. */
const META_STANDARD_EVENTS = {
  purchase: "Purchase",
  add_to_cart: "AddToCart",
  view_item: "ViewContent",
  begin_checkout: "InitiateCheckout",
  add_payment_info: "AddPaymentInfo",
  view_cart: "ViewCart",
  search: "Search",
  lead: "Lead",
  complete_registration: "CompleteRegistration",
};

/** Keys mapped into Meta fbq payloads (must exist as DLVs). */
const META_PAYLOAD_KEYS = [
  "value",
  "currency",
  "content_ids",
  "content_type",
  "content_name",
  "contents",
  "num_items",
  "order_id",
  "transaction_id",
];

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    throw new Error(`Invalid JSON in ${label} (${filePath}): ${err.message}`);
  }
}

function nextId(list, idKey) {
  let max = 0;
  for (const item of list || []) {
    const n = Number.parseInt(String(item[idKey] ?? "0"), 10);
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return max + 1;
}

function namesSet(list) {
  return new Set((list || []).map((x) => x.name).filter(Boolean));
}

function findByName(list, name) {
  return (list || []).find((x) => x.name === name) || null;
}

function findTriggerForEvent(triggers, eventName) {
  const preferred = findByName(triggers, `Event - ${eventName}`);
  if (preferred) return preferred;
  for (const t of triggers || []) {
    if (t.type !== "CUSTOM_EVENT" && t.type !== "customEvent") continue;
    const arg1 = t.customEventFilter?.[0]?.parameter?.find(
      (p) => p.key === "arg1"
    )?.value;
    if (arg1 === eventName) return t;
  }
  return null;
}

/** Prefer flat DLV keys for GA4 event params (dots → invalid GA4 names anyway). */
function ga4KeysFromManifest(keys) {
  const flat = keys.filter((k) => !k.includes("."));
  const nestedKeep = [
    "ecommerce.value",
    "ecommerce.items",
    "ecommerce.transaction_id",
    "ecommerce.currency",
    "ecommerce.coupon",
    "ecommerce.discount",
  ];
  return [...flat, ...nestedKeep.filter((k) => keys.includes(k))];
}

/** Events that push an `ecommerce` object via pushEcommerce(). */
const ECOMMERCE_EVENTS = new Set([
  "view_item",
  "select_item",
  "add_to_cart",
  "remove_from_cart",
  "view_cart",
  "begin_checkout",
  "add_shipping_info",
  "add_payment_info",
  "purchase",
  "update_cart",
  "view_out_of_stock",
]);

function param(type, key, value) {
  return { type, key, value: String(value) };
}

function dlvRef(key) {
  return `{{DLV - ${key}}}`;
}

/** GA4 event parameter names cannot contain dots. */
function ga4ParamName(key) {
  return key.replace(/\./g, "_");
}

function extractMeasurementId(cv) {
  for (const tag of cv.tag || []) {
    if (tag.type === "googtag") {
      const id = tag.parameter?.find((p) => p.key === "tagId")?.value;
      if (id) return id;
    }
    if (tag.type === "gaawe") {
      const id = tag.parameter?.find((p) => p.key === "measurementIdOverride")
        ?.value;
      if (id) return id;
    }
  }
  return "G-XXXXXXXX";
}

function extractPixelId(cv) {
  for (const tag of cv.tag || []) {
    const id = tag.parameter?.find((p) => p.key === "pixelId")?.value;
    if (id) return id;
  }
  // Fallback: scan Custom HTML for fbq('init', '…')
  for (const tag of cv.tag || []) {
    if (tag.type !== "html") continue;
    const html = tag.parameter?.find((p) => p.key === "html")?.value || "";
    const m = html.match(/fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/);
    if (m) return m[1];
  }
  return null;
}

function makeVariable(key, id, accountId, containerId) {
  return {
    accountId,
    containerId,
    variableId: String(id),
    name: `DLV - ${key}`,
    type: "v",
    parameter: [
      param("INTEGER", "dataLayerVersion", "2"),
      param("BOOLEAN", "setDefaultValue", "false"),
      param("TEMPLATE", "name", key),
    ],
    formatValue: {},
  };
}

function makeTrigger(eventName, id, accountId, containerId) {
  return {
    accountId,
    containerId,
    triggerId: String(id),
    name: `Event - ${eventName}`,
    type: "CUSTOM_EVENT",
    customEventFilter: [
      {
        type: "EQUALS",
        parameter: [
          param("TEMPLATE", "arg0", "{{_event}}"),
          param("TEMPLATE", "arg1", eventName),
        ],
      },
    ],
  };
}

function makeGa4EventParameters(keys) {
  return {
    type: "LIST",
    key: "eventParameters",
    list: keys.map((key) => ({
      type: "MAP",
      map: [
        param("TEMPLATE", "name", ga4ParamName(key)),
        param("TEMPLATE", "value", dlvRef(key)),
      ],
    })),
  };
}

function makeGa4Tag({
  eventName,
  tagId,
  triggerId,
  accountId,
  containerId,
  measurementId,
  keys,
}) {
  const sendEcommerce = ECOMMERCE_EVENTS.has(eventName);
  return {
    accountId,
    containerId,
    tagId: String(tagId),
    name: `GA4 - ${eventName}`,
    type: "gaawe",
    parameter: [
      // Data layer is source of truth: ecommerce events send the ecommerce object
      param("BOOLEAN", "sendEcommerceData", sendEcommerce ? "true" : "false"),
      ...(sendEcommerce
        ? [param("TEMPLATE", "getEcommerceDataFrom", "dataLayer")]
        : []),
      param("TEMPLATE", "eventName", eventName),
      param("TEMPLATE", "measurementIdOverride", measurementId),
      // Always map flat DLVs as event params too (coupon, source, etc.)
      makeGa4EventParameters(keys),
    ],
    firingTriggerId: [String(triggerId)],
    tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: { type: "MAP" },
    consentSettings: { consentStatus: "NOT_SET" },
  };
}

function buildMetaBaseHtml(pixelId) {
  return `<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>`;
}

function buildMetaHtml(eventName) {
  const standard = META_STANDARD_EVENTS[eventName];
  const method = standard ? "track" : "trackCustom";
  const metaEvent = standard || eventName;

  // IMPORTANT: never interpolate bare {{DLV}} into JS (empty → syntax error → Failed).
  // Always read as strings, then coerce.
  return `<script>
(function () {
  if (typeof fbq !== 'function') return;

  function str(v) {
    if (v === undefined || v === null) return '';
    return String(v).trim();
  }
  function nonempty(v) {
    var s = str(v);
    if (!s || s === 'undefined' || s === 'null') return undefined;
    return s;
  }
  function asNumber(v) {
    var s = nonempty(v);
    if (s === undefined) return undefined;
    var n = Number(s);
    return isNaN(n) ? undefined : n;
  }
  function asJsonOrString(v) {
    var s = nonempty(v);
    if (s === undefined) return undefined;
    if (s.charAt(0) === '[' || s.charAt(0) === '{') {
      try { return JSON.parse(s); } catch (e) {}
    }
    if (s.indexOf(',') !== -1) {
      return s.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    }
    return s;
  }

  var payload = {};
  var value = asNumber('{{DLV - value}}');
  if (value !== undefined) payload.value = value;
  var currency = nonempty('{{DLV - currency}}');
  if (currency) payload.currency = currency;
  var content_type = nonempty('{{DLV - content_type}}');
  if (content_type) payload.content_type = content_type;
  var content_name = nonempty('{{DLV - content_name}}');
  if (content_name) payload.content_name = content_name;
  var content_ids = asJsonOrString('{{DLV - content_ids}}');
  if (content_ids !== undefined) payload.content_ids = content_ids;
  var num_items = asNumber('{{DLV - num_items}}');
  if (num_items !== undefined) payload.num_items = num_items;
  var order_id = nonempty('{{DLV - order_id}}') || nonempty('{{DLV - transaction_id}}');
  if (order_id) payload.order_id = order_id;

  fbq('${method}', '${metaEvent}', payload);
})();
</script>`;
}

function makeMetaBaseTag({ tagId, accountId, containerId, pixelId }) {
  // Built-in GTM "Initialization" / All Pages trigger
  const ALL_PAGES_TRIGGER = "2147479553";
  return {
    accountId,
    containerId,
    tagId: String(tagId),
    name: "Meta - Pixel Base",
    type: "html",
    parameter: [
      param("TEMPLATE", "html", buildMetaBaseHtml(pixelId)),
      param("BOOLEAN", "supportDocumentWrite", "false"),
    ],
    firingTriggerId: [ALL_PAGES_TRIGGER],
    tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: { type: "MAP" },
    consentSettings: { consentStatus: "NOT_SET" },
  };
}

function makeMetaTag({
  eventName,
  tagId,
  triggerId,
  accountId,
  containerId,
}) {
  return {
    accountId,
    containerId,
    tagId: String(tagId),
    name: `Meta - ${eventName}`,
    type: "html",
    parameter: [
      param("TEMPLATE", "html", buildMetaHtml(eventName)),
      param("BOOLEAN", "supportDocumentWrite", "false"),
    ],
    firingTriggerId: [String(triggerId)],
    tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: { type: "MAP" },
    consentSettings: { consentStatus: "NOT_SET" },
  };
}

function isUnsafeMetaHtml(html) {
  if (!html) return true;
  // bare DLV interpolations break when undefined
  return /\w+:\s*\{\{DLV -/.test(html);
}

function ensureArrays(cv) {
  if (!Array.isArray(cv.variable)) cv.variable = [];
  if (!Array.isArray(cv.trigger)) cv.trigger = [];
  if (!Array.isArray(cv.tag)) cv.tag = [];
}

function containerShell(seedContainer, accountId, containerId) {
  const c = seedContainer || {};
  const shell = {
    path: c.path || `accounts/${accountId}/containers/${containerId}`,
    accountId,
    containerId,
    name: c.name,
    publicId: c.publicId,
    usageContext: c.usageContext || ["WEB"],
    features: c.features,
    tagIds: c.tagIds || (c.publicId ? [c.publicId] : undefined),
  };
  for (const k of Object.keys(shell)) {
    if (shell[k] === undefined) delete shell[k];
  }
  return shell;
}

function main() {
  const seedPath = path.resolve(process.argv[2] || DEFAULT_SEED);
  const manifestPath = path.resolve(process.argv[3] || DEFAULT_MANIFEST);
  const outPath = path.resolve(process.argv[4] || DEFAULT_OUT);

  const manifest = readJson(manifestPath, "tracking_manifest.json");
  const seed = readJson(seedPath, "seed.json");

  const events = Array.isArray(manifest.events) ? [...manifest.events] : [];
  const keys = Array.isArray(manifest.keys) ? [...manifest.keys] : [];

  if (!events.length) throw new Error("manifest.events is empty");
  if (!keys.length) throw new Error("manifest.keys is empty");

  const seedCv = seed.containerVersion;
  if (!seedCv?.container?.publicId) {
    throw new Error("Invalid seed: missing containerVersion.container.publicId");
  }
  ensureArrays(seedCv);

  const accountId = String(
    seedCv.accountId || seedCv.container.accountId || seedCv.variable[0]?.accountId
  );
  const containerId = String(
    seedCv.containerId ||
      seedCv.container.containerId ||
      seedCv.variable[0]?.containerId
  );
  if (!accountId || !containerId) {
    throw new Error("Could not resolve accountId / containerId from seed");
  }

  const measurementId = extractMeasurementId(seedCv);
  const pixelId = extractPixelId(seedCv);
  const ga4Keys = ga4KeysFromManifest(keys);

  let nextVarId = nextId(seedCv.variable, "variableId");
  let nextTriggerId = nextId(seedCv.trigger, "triggerId");
  let nextTagId = nextId(seedCv.tag, "tagId");

  const existingVarNames = namesSet(seedCv.variable);
  const existingTagNames = namesSet(seedCv.tag);

  /** @type {object[]} */
  const newVariables = [];
  /** @type {object[]} */
  const newTriggers = [];
  /** @type {object[]} */
  const newTags = [];

  // ── A. Variables ──────────────────────────────────────────────────────────
  let varsSkipped = 0;
  for (const key of keys) {
    const name = `DLV - ${key}`;
    if (existingVarNames.has(name)) {
      varsSkipped += 1;
      continue;
    }
    newVariables.push(makeVariable(key, nextVarId, accountId, containerId));
    existingVarNames.add(name);
    nextVarId += 1;
  }

  // ── B + C. Triggers & Tags ────────────────────────────────────────────────
  // Data layer = source of truth.
  // For EVERY manifest event, ensure EXACT names exist:
  //   Event - <event>   (Custom Event trigger on that exact event string)
  //   GA4 - <event>     (gaawe, eventName = same string, bound to that trigger)
  //   Meta - <event>    (html fbq, bound to that trigger)
  // Idempotency is EXACT name only — never fuzzy-match old "GA4 - Event - …" tags.
  let triggersCreated = 0;
  let triggersSkipped = 0;
  let ga4Created = 0;
  let ga4Skipped = 0;
  let metaCreated = 0;
  let metaSkipped = 0;
  let metaNeedsDelete = [];
  /** @type {Map<string, string>} */
  const triggerIdByEvent = new Map();
  /** @type {Map<string, object>} */
  const deltaTriggersById = new Map();

  function ensureDeltaTrigger(eventName) {
    if (triggerIdByEvent.has(eventName)) {
      return triggerIdByEvent.get(eventName);
    }

    const exactName = `Event - ${eventName}`;
    const existing = findByName(seedCv.trigger, exactName);
    if (existing) {
      const copy = structuredClone(existing);
      delete copy.fingerprint;
      delete copy.path;
      // Force filter to exact data-layer event name (in case seed drifted)
      if (copy.customEventFilter?.[0]?.parameter) {
        const arg1 = copy.customEventFilter[0].parameter.find(
          (p) => p.key === "arg1"
        );
        if (arg1) arg1.value = eventName;
      }
      deltaTriggersById.set(String(copy.triggerId), copy);
      triggerIdByEvent.set(eventName, String(copy.triggerId));
      triggersSkipped += 1;
      return String(copy.triggerId);
    }

    const trigger = makeTrigger(
      eventName,
      nextTriggerId,
      accountId,
      containerId
    );
    deltaTriggersById.set(String(nextTriggerId), trigger);
    seedCv.trigger.push(trigger);
    triggerIdByEvent.set(eventName, String(nextTriggerId));
    nextTriggerId += 1;
    triggersCreated += 1;
    return triggerIdByEvent.get(eventName);
  }

  // Meta Pixel must be initialized or event tags no-op / fail
  if (!findByName(seedCv.tag, "Meta - Pixel Base") && pixelId) {
    newTags.push(
      makeMetaBaseTag({
        tagId: nextTagId,
        accountId,
        containerId,
        pixelId,
      })
    );
    existingTagNames.add("Meta - Pixel Base");
    nextTagId += 1;
    metaCreated += 1;
  }

  // Flag legacy broken community-template Meta tag
  for (const t of seedCv.tag) {
    if (t.type?.startsWith("cvt_") && t.name?.startsWith("Meta")) {
      metaNeedsDelete.push(
        `${t.name} (legacy Meta template — Event Name "eec", pause/delete it)`
      );
    }
  }

  for (const eventName of events) {
    const triggerId = ensureDeltaTrigger(eventName);

    const ga4Name = `GA4 - ${eventName}`;
    if (findByName(seedCv.tag, ga4Name) || existingTagNames.has(ga4Name)) {
      ga4Skipped += 1;
    } else {
      const tag = makeGa4Tag({
        eventName,
        tagId: nextTagId,
        triggerId,
        accountId,
        containerId,
        measurementId,
        keys: ga4Keys,
      });
      newTags.push(tag);
      seedCv.tag.push(tag);
      existingTagNames.add(ga4Name);
      nextTagId += 1;
      ga4Created += 1;
    }

    const metaName = `Meta - ${eventName}`;
    const existingMeta = findByName(seedCv.tag, metaName);
    const existingHtml = existingMeta?.parameter?.find((p) => p.key === "html")
      ?.value;
    const needsMetaFix =
      !existingMeta ||
      existingMeta.type !== "html" ||
      isUnsafeMetaHtml(existingHtml);

    if (existingMeta && !needsMetaFix) {
      metaSkipped += 1;
    } else {
      if (existingMeta && needsMetaFix) {
        metaNeedsDelete.push(
          `${metaName} (broken Custom HTML — delete, then re-import)`
        );
      }
      // If name already exists, emit as Meta - event (fixed) — user must delete old first
      const emitName = existingMeta && needsMetaFix
        ? `Meta - ${eventName}`
        : metaName;
      if (existingMeta && needsMetaFix) {
        // still emit same name; merge will conflict unless deleted
      }
      const tag = makeMetaTag({
        eventName,
        tagId: nextTagId,
        triggerId,
        accountId,
        containerId,
      });
      // keep exact name for data-layer parity
      tag.name = emitName;
      newTags.push(tag);
      seedCv.tag.push(tag);
      existingTagNames.add(emitName);
      nextTagId += 1;
      metaCreated += 1;
    }
  }

  const deltaTriggers = [...deltaTriggersById.values()];
  newTriggers.push(...deltaTriggers);

  // Verify coverage: every data-layer event has trigger + both tags in seed∪delta
  const coverageGaps = [];
  for (const eventName of events) {
    const hasTrigger =
      triggerIdByEvent.has(eventName) ||
      !!findByName(seedCv.trigger, `Event - ${eventName}`);
    const hasGa4 =
      !!findByName(seedCv.tag, `GA4 - ${eventName}`) ||
      existingTagNames.has(`GA4 - ${eventName}`);
    const hasMeta =
      !!findByName(seedCv.tag, `Meta - ${eventName}`) ||
      existingTagNames.has(`Meta - ${eventName}`);
    if (!hasTrigger || !hasGa4 || !hasMeta) {
      coverageGaps.push(
        `${eventName} (trigger=${hasTrigger} ga4=${hasGa4} meta=${hasMeta})`
      );
    }
  }
  if (coverageGaps.length) {
    throw new Error(
      `Data-layer coverage gaps after generate:\n  - ${coverageGaps.join("\n  - ")}`
    );
  }

  if (!newVariables.length && !newTriggers.length && !newTags.length) {
    throw new Error(
      "Nothing new to import — seed already has all exact Event-/GA4-/Meta- entities."
    );
  }

  // Validate: every NEW event-tag firingTriggerId exists in delta triggers
  // (Meta - Pixel Base uses built-in All Pages trigger 2147479553)
  const deltaTriggerIds = new Set(deltaTriggers.map((t) => String(t.triggerId)));
  for (const tag of newTags) {
    if (tag.name === "Meta - Pixel Base") continue;
    for (const id of tag.firingTriggerId || []) {
      if (!deltaTriggerIds.has(String(id))) {
        throw new Error(
          `Internal error: tag "${tag.name}" fires on trigger ${id} missing from delta`
        );
      }
    }
  }

  // Merge-safe delta: NEW entities only. No customTemplate / no legacy tags.
  const out = {
    exportFormatVersion: 2,
    exportTime: new Date().toISOString().replace("T", " ").slice(0, 19),
    containerVersion: {
      path:
        seedCv.path ||
        `accounts/${accountId}/containers/${containerId}/versions/0`,
      accountId,
      containerId,
      containerVersionId: "0",
      container: containerShell(seedCv.container, accountId, containerId),
      trigger: newTriggers,
      ...(newVariables.length ? { variable: newVariables } : {}),
      ...(newTags.length ? { tag: newTags } : {}),
    },
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");

  console.log("══════════════════════════════════════════════");
  console.log(" generate_gtm.js — data-layer → GTM (exact)");
  console.log("══════════════════════════════════════════════");
  console.log(` Manifest events:          ${events.length}`);
  console.log(` Manifest keys:            ${keys.length}`);
  console.log(` GA4 params per event:     ${ga4Keys.length}`);
  console.log(` Measurement ID:           ${measurementId}`);
  console.log(
    ` Meta pixel ID (seed):     ${pixelId || "(not found — base pixel must already be live)"}`
  );
  console.log("──────────────────────────────────────────────");
  console.log(
    ` Variables in delta:       ${newVariables.length}  (skipped existing: ${varsSkipped})`
  );
  console.log(
    ` Triggers in delta:        ${newTriggers.length}  (created: ${triggersCreated}, reused Event-: ${triggersSkipped})`
  );
  console.log(` Tags in delta:            ${newTags.length}`);
  console.log(`   ├─ GA4:                 ${ga4Created}  (skipped exact: ${ga4Skipped})`);
  console.log(`   └─ Meta:                ${metaCreated}  (skipped exact: ${metaSkipped})`);
  if (metaNeedsDelete.length) {
    console.log("──────────────────────────────────────────────");
    console.log(" BEFORE IMPORT — pause/delete these in GTM:");
    for (const line of [...new Set(metaNeedsDelete)]) {
      console.log(`   • ${line}`);
    }
  }
  console.log("──────────────────────────────────────────────");
  console.log(" Coverage: every manifest event → Event - / GA4 - / Meta - (exact names)");
  console.log(` Output: ${outPath}`);
  console.log(" Import: Admin → Import → Merge → Preview → Confirm → PUBLISH");
  console.log("══════════════════════════════════════════════");
}

try {
  main();
} catch (err) {
  console.error("\n✗ generate_gtm.js failed:\n ", err.message || err);
  process.exit(1);
}
