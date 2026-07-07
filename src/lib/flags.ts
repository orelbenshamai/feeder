/**
 * STOCK_MODE controls the PDP call-to-action:
 *
 *  "notify"  → pre-launch mode: every variant shows "הודיעו לי כשחוזר למלאי"
 *              (variant.inStock is ignored – all treated as out-of-stock)
 *
 *  "live"    → launch mode: normal add-to-cart flow; out-of-stock variants
 *              still show the notify action based on variant.inStock
 */
export const STOCK_MODE: "notify" | "live" = "live";
