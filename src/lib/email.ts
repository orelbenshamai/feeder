// ─── Order notification emails (server-side) ─────────────────────────────────
import "server-only";
// Uses Resend: https://resend.com/docs/api-reference/emails/send-email
// Env: RESEND_API_KEY (required), RESEND_FROM (optional), ORDER_NOTIFICATION_EMAIL (optional)

const RESEND_API = "https://api.resend.com/emails";

const MANAGER_EMAIL =
  process.env.ORDER_NOTIFICATION_EMAIL ?? "mesudar.pets@gmail.com";

const FROM_EMAIL =
  process.env.RESEND_FROM ?? "MESUDAR Orders <onboarding@resend.dev>";

type OrderItem = {
  productName?: string;
  bundleLabel?: string;
  sku: string;
  sizeLabel?: string;
  colorLabel?: string;
  quantity: number;
  price: number;
};

type OrderContact = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  street?: string;
  city?: string;
  zip?: string;
};

export function buildManagerOrderEmail(params: {
  orderId: string;
  items: OrderItem[];
  paidAmount: number;
  contact: OrderContact;
  hypTransactionId?: string;
}): { subject: string; text: string } {
  const { orderId, items, paidAmount, contact, hypTransactionId } = params;

  const itemLines = items
    .map((item) => {
      const name = item.bundleLabel ?? item.productName ?? item.sku;
      const variant = [item.sizeLabel, item.colorLabel].filter(Boolean).join(" · ");
      const lineTotal = item.price * item.quantity;
      return `• ${name}${variant ? ` — ${variant}` : ""} × ${item.quantity}    ₪${lineTotal}`;
    })
    .join("\n");

  const addressParts = [contact.street, contact.city, contact.zip].filter(Boolean);
  const address = addressParts.length ? addressParts.join(", ") : "—";

  const subject = `הזמנה חדשה ${orderId} — ₪${paidAmount}`;

  const text = [
    "התקבלה הזמנה חדשה באתר MESUDAR",
    "",
    `מספר הזמנה: ${orderId}`,
    ...(hypTransactionId ? [`מזהה עסקה Hyp: ${hypTransactionId}`] : []),
    `סה״כ שולם: ₪${paidAmount}`,
    "",
    "פריטים:",
    itemLines,
    "",
    "פרטי לקוח:",
    `שם: ${contact.firstName} ${contact.lastName}`,
    `טלפון: ${contact.phone}`,
    ...(contact.email ? [`אימייל: ${contact.email}`] : []),
    `כתובת: ${address}`,
  ].join("\n");

  return { subject, text };
}

export async function sendManagerOrderNotification(params: {
  orderId: string;
  items: OrderItem[];
  paidAmount: number;
  contact: OrderContact;
  hypTransactionId?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY not set — skipping manager order notification",
    );
    return;
  }

  const { subject, text } = buildManagerOrderEmail(params);

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [MANAGER_EMAIL],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[email] send failed:", res.status, body);
  }
}
