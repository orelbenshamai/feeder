// ─── wa.me links (client-safe) ───────────────────────────────────────────────

/** Israeli mobile 055-995-9864 → WhatsApp wa.me expects country code without leading 0 */
export const WHATSAPP_E164 = "972559959864";

const BASE = `https://wa.me/${WHATSAPP_E164}`;

/** Default Hebrew opener pre-fill */
export const WHATSAPP_PREFILL_HE = "הי, אני מתעניין בעמדת ההאכלה";

export function whatsAppHref(prefill?: string): string {
  if (!prefill) return BASE;
  return `${BASE}?text=${encodeURIComponent(prefill)}`;
}

// ─── Green API — server-side automated messaging ──────────────────────────────
// Docs: https://green-api.com/en/docs/api/sending/SendMessage/

/** Normalise an Israeli phone number to the E.164 chatId format Green API needs, e.g. "972501234567@c.us" */
function toChatId(phone: string): string {
  // Strip all non-digit chars
  let digits = phone.replace(/\D/g, "");

  // Israeli local: 05x / 07x  →  prefix with country code
  if (digits.startsWith("0")) {
    digits = "972" + digits.slice(1);
  }

  return `${digits}@c.us`;
}

export async function sendWhatsApp(
  phone: string,
  message: string
): Promise<void> {
  const instanceId = process.env.GREEN_API_INSTANCE;
  const token = process.env.GREEN_API_TOKEN;

  if (!instanceId || !token) {
    console.warn("[whatsapp] GREEN_API_INSTANCE / GREEN_API_TOKEN not set — skipping");
    return;
  }

  const url = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId: toChatId(phone), message }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[whatsapp] sendMessage failed:", res.status, body);
  }
}

// ─── Invoice builder ──────────────────────────────────────────────────────────

type InvoiceItem = {
  productName?: string;
  bundleLabel?: string;
  sku: string;
  sizeLabel?: string;
  colorLabel?: string;
  quantity: number;
  price: number;
};

type InvoiceContact = {
  firstName: string;
  lastName: string;
  phone: string;
  street?: string;
  city?: string;
  zip?: string;
};

export function buildInvoiceMessage(params: {
  orderId: string;
  items: InvoiceItem[];
  paidAmount: number;
  contact: InvoiceContact;
}): string {
  const { orderId, items, paidAmount, contact } = params;

  const itemLines = items
    .map((item) => {
      const name = item.bundleLabel ?? item.productName ?? item.sku;
      const variant = [item.sizeLabel, item.colorLabel].filter(Boolean).join(" · ");
      const lineTotal = item.price * item.quantity;
      return `• ${name}${variant ? ` — ${variant}` : ""} × ${item.quantity}    ₪${lineTotal}`;
    })
    .join("\n");

  const addressParts = [contact.street, contact.city, contact.zip].filter(Boolean);
  const address = addressParts.length ? addressParts.join(", ") : "";

  return [
    `✅ *ההזמנה שלך התקבלה!*`,
    ``,
    `🧾 *סיכום הזמנה*`,
    itemLines,
    ``,
    `💰 *סה״כ שולם:* ₪${paidAmount}`,
    ``,
    `📦 *פרטי משלוח*`,
    `שם: ${contact.firstName} ${contact.lastName}`,
    `טלפון: ${contact.phone}`,
    ...(address ? [`כתובת: ${address}`] : []),
    ``,
    `מספר הזמנה: ${orderId}`,
    ``,
    `תודה שקנית ב-MESUDAR! 🐾`,
  ].join("\n");
}
