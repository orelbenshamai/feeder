type PixelItem = {
  id: string;
  quantity: number;
};

function track(event: string, data?: object, custom = false) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq(custom ? "trackCustom" : "track", event, data);
}

export function trackAddToCart(params: {
  sku: string;
  productId: string;
  value: number;
  quantity?: number;
}) {
  track("AddToCart", {
    content_ids: [params.sku],
    content_type: "product",
    content_name: params.productId,
    value: params.value,
    currency: "ILS",
    num_items: params.quantity ?? 1,
  });
}

/** Distinct Meta Pixel event for feeder + mat bundle purchases. */
export function trackAddToCartBundle(params: {
  bundleSku: string;
  componentSkus: string[];
  value: number;
  quantity?: number;
}) {
  const items: PixelItem[] = [
    { id: params.bundleSku, quantity: params.quantity ?? 1 },
    ...params.componentSkus.map((id) => ({ id, quantity: params.quantity ?? 1 })),
  ];

  track(
    "AddToCartBundle",
    {
      content_ids: [params.bundleSku, ...params.componentSkus],
      content_type: "product",
      content_name: "feeder-mat-bundle",
      value: params.value,
      currency: "ILS",
      num_items: items.length,
      bundle_sku: params.bundleSku,
    },
    true,
  );
}
