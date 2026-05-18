/** Israeli mobile 055-995-9864 → WhatsApp wa.me expects country code without leading 0 */
export const WHATSAPP_E164 = "972559959864";

const BASE = `https://wa.me/${WHATSAPP_E164}`;

/** Default Hebrew opener pre-fill */
export const WHATSAPP_PREFILL_HE =
  "הי, אני מתעניין בעמדת ההאכלה";

export function whatsAppHref(prefill?: string): string {
  if (!prefill) return BASE;
  return `${BASE}?text=${encodeURIComponent(prefill)}`;
}
