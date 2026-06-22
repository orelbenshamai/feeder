/**
 * Centralized BI tracking utility.
 *
 * All events are pushed to the GTM DataLayer via sendGTMEvent.
 * GTM is configured to forward these automatically to GA4 and Meta Pixel.
 *
 * GA4 ecommerce schema: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

import { sendGTMEvent } from "@next/third-parties/google";

/** Clear previous ecommerce data before pushing a new event (GA4 best practice). */
function clearEcommerce() {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dataLayer?.push({ ecommerce: null });
  }
}

// ── Single product ──────────────────────────────────────────────────────────

export type TrackAddToCartParams = {
  sku: string;
  productId: string;
  productName: string;
  value: number;
  quantity?: number;
};

export function trackAddToCart({
  sku,
  productId,
  productName,
  value,
  quantity = 1,
}: TrackAddToCartParams) {
  clearEcommerce();
  sendGTMEvent({
    event: "add_to_cart",
    ecommerce: {
      currency: "ILS",
      value,
      items: [
        {
          item_id: sku,
          item_name: productName,
          item_variant: productId,
          price: value,
          quantity,
          currency: "ILS",
        },
      ],
    },
  });
}

// ── Bundle ──────────────────────────────────────────────────────────────────

export type TrackAddToCartBundleParams = {
  bundleSku: string;
  componentSkus: string[];
  productName: string;
  value: number;
  quantity?: number;
};

export function trackAddToCartBundle({
  bundleSku,
  componentSkus,
  productName,
  value,
  quantity = 1,
}: TrackAddToCartBundleParams) {
  clearEcommerce();
  sendGTMEvent({
    event: "add_to_cart",
    ecommerce: {
      currency: "ILS",
      value,
      items: [
        {
          item_id: bundleSku,
          item_name: productName,
          item_variant: "bundle",
          price: value,
          quantity,
          currency: "ILS",
        },
        ...componentSkus.map((sku) => ({
          item_id: sku,
          item_name: productName,
          item_variant: "bundle-component",
          price: 0,
          quantity,
          currency: "ILS",
        })),
      ],
    },
  });
}
