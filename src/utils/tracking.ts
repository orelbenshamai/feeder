/**
 * Centralized BI tracking utility.
 *
 * All events are pushed to the GTM DataLayer via sendGTMEvent.
 * GTM reads these keys as Data Layer Variables, then feeds GA4 / Meta tags.
 *
 * GTM setup (Variables → New → Data Layer Variable):
 *   Ecommerce:   ecommerce.value | ecommerce.currency | ecommerce.items
 *                ecommerce.transaction_id | ecommerce.coupon | ecommerce.discount
 *   Flat:        value | currency | transaction_id | coupon | discount | discount_amount
 *                items | num_items | item_id | item_name | item_brand | item_variant
 *                item_category | price | quantity | is_bundle | payment_provider
 *   Meta:        content_ids | content_type | content_name
 *   Custom:      product_id | product_name | sku | source | error_message | …
 *
 * Event names use GA4 ecommerce conventions:
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

import { sendGTMEvent } from "@next/third-parties/google";
import type { CartLineItem } from "@/types/product";

const CURRENCY = "ILS";
const BRAND = "MESUDAR";
const PAYMENT_PROVIDER = "hyp";

export type TrackingItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_variant?: string;
  item_category?: string;
  price: number;
  quantity: number;
  currency?: string;
};

function normalizeItem(item: TrackingItem): TrackingItem {
  return {
    ...item,
    item_brand: item.item_brand ?? BRAND,
    currency: item.currency ?? CURRENCY,
  };
}

function normalizeItems(items: TrackingItem[]): TrackingItem[] {
  return items.map(normalizeItem);
}

function itemCount(items: TrackingItem[]): number {
  return items.reduce((sum, i) => sum + (i.quantity || 0), 0);
}

function isBundleItems(items: TrackingItem[]): boolean {
  return items.some(
    (i) => i.item_category === "bundle" || i.item_variant === "bundle"
  );
}

/** Clear previous ecommerce object before pushing a new one (GA4 best practice). */
function clearEcommerce() {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dataLayer?.push({ ecommerce: null });
  }
}

/**
 * Push a GA4 ecommerce event.
 * Writes both `ecommerce.*` (GA4 schema) and flat top-level aliases so GTM
 * Data Layer Variables can bind without nested paths if preferred.
 */
function pushEcommerce(
  event: string,
  ecommerce: Record<string, unknown>,
  extra?: Record<string, unknown>
) {
  clearEcommerce();
  const rawItems = Array.isArray(ecommerce.items)
    ? (ecommerce.items as TrackingItem[])
    : [];
  const items = normalizeItems(rawItems);
  const primary = items[0];
  const numItems = itemCount(items);
  const bundle = isBundleItems(items);
  const discount =
    ecommerce.discount ??
    ecommerce.discount_amount ??
    extra?.discount ??
    extra?.discount_amount;

  const ec: Record<string, unknown> = {
    currency: CURRENCY,
    ...ecommerce,
    items,
    ...(discount != null ? { discount } : {}),
  };

  const contentIds = items.map((i) => i.item_id).filter(Boolean);

  sendGTMEvent({
    event,
    ecommerce: ec,
    // ── Flat aliases for GTM Data Layer Variables ──────────────────────────
    currency: ec.currency,
    value: ec.value,
    transaction_id: ec.transaction_id,
    coupon: ec.coupon,
    discount,
    discount_amount: discount,
    shipping: ec.shipping,
    tax: ec.tax,
    payment_type: ec.payment_type,
    payment_provider: extra?.payment_provider ?? PAYMENT_PROVIDER,
    shipping_tier: ec.shipping_tier,
    item_list_name: ec.item_list_name,
    items,
    num_items: numItems,
    is_bundle: bundle,
    item_id: primary?.item_id,
    item_name: primary?.item_name,
    item_brand: primary?.item_brand ?? BRAND,
    item_variant: primary?.item_variant,
    item_category: primary?.item_category,
    price: primary?.price,
    quantity: primary?.quantity,
    // ── Meta Pixel–friendly aliases ────────────────────────────────────────
    content_type: "product",
    content_ids: contentIds,
    content_name: primary?.item_name,
    contents: items.map((i) => ({
      id: i.item_id,
      quantity: i.quantity,
      item_price: i.price,
    })),
    ...extra,
  });
}

function pushEvent(event: string, payload?: Record<string, unknown>) {
  sendGTMEvent({ event, ...payload });
}

/** Map a cart line to a GA4 ecommerce item. */
export function cartLineToTrackingItem(item: CartLineItem): TrackingItem {
  return normalizeItem({
    item_id: item.bundleSku ?? item.sku,
    item_name: item.bundleLabel ?? item.productName,
    item_variant: [item.sizeLabel, item.colorLabel].filter(Boolean).join(" / "),
    item_category: item.bundleSku ? "bundle" : "product",
    price: item.price,
    quantity: item.quantity,
  });
}

export function cartLinesToTrackingItems(items: CartLineItem[]): TrackingItem[] {
  return items.map(cartLineToTrackingItem);
}

export function cartValue(items: CartLineItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartNumItems(items: CartLineItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

// ── view_item ───────────────────────────────────────────────────────────────

export type TrackViewItemParams = {
  sku: string;
  productId: string;
  productName: string;
  value: number;
  sizeLabel?: string;
  colorLabel?: string;
  quantity?: number;
};

export function trackViewItem({
  sku,
  productId,
  productName,
  value,
  sizeLabel,
  colorLabel,
  quantity = 1,
}: TrackViewItemParams) {
  pushEcommerce("view_item", {
    value,
    items: [
      {
        item_id: sku,
        item_name: productName,
        item_variant: [sizeLabel, colorLabel].filter(Boolean).join(" / ") || productId,
        price: value,
        quantity,
        currency: CURRENCY,
      },
    ],
  }, {
    product_id: productId,
    product_name: productName,
    sku,
    size_label: sizeLabel,
    color_label: colorLabel,
  });
}

// ── select_item (size / color change on PDP) ────────────────────────────────

export type TrackSelectItemParams = TrackViewItemParams & {
  listName?: string;
};

export function trackSelectItem({
  sku,
  productId,
  productName,
  value,
  sizeLabel,
  colorLabel,
  listName = "pdp_variants",
}: TrackSelectItemParams) {
  pushEcommerce("select_item", {
    item_list_name: listName,
    items: [
      {
        item_id: sku,
        item_name: productName,
        item_variant: [sizeLabel, colorLabel].filter(Boolean).join(" / ") || productId,
        price: value,
        quantity: 1,
        currency: CURRENCY,
      },
    ],
  }, {
    product_id: productId,
    product_name: productName,
    sku,
    size_label: sizeLabel,
    color_label: colorLabel,
  });
}

// ── add_to_cart ─────────────────────────────────────────────────────────────

export type TrackAddToCartParams = {
  sku: string;
  productId: string;
  productName: string;
  value: number;
  quantity?: number;
  sizeLabel?: string;
  colorLabel?: string;
};

export function trackAddToCart({
  sku,
  productId,
  productName,
  value,
  quantity = 1,
  sizeLabel,
  colorLabel,
}: TrackAddToCartParams) {
  // `value` is the unit price
  pushEcommerce("add_to_cart", {
    value: value * quantity,
    items: [
      {
        item_id: sku,
        item_name: productName,
        item_variant: [sizeLabel, colorLabel].filter(Boolean).join(" / ") || productId,
        price: value,
        quantity,
        currency: CURRENCY,
      },
    ],
  }, {
    product_id: productId,
    product_name: productName,
    sku,
    size_label: sizeLabel,
    color_label: colorLabel,
  });
}

// ── add_to_cart (bundle) ────────────────────────────────────────────────────

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
  // `value` is the unit bundle price
  pushEcommerce("add_to_cart", {
    value: value * quantity,
    items: [
      {
        item_id: bundleSku,
        item_name: productName,
        item_variant: "bundle",
        item_category: "bundle",
        price: value,
        quantity,
        currency: CURRENCY,
      },
      ...componentSkus.map((sku) => ({
        item_id: sku,
        item_name: productName,
        item_variant: "bundle-component",
        item_category: "bundle",
        price: 0,
        quantity,
        currency: CURRENCY,
      })),
    ],
  });
}

// ── remove_from_cart ────────────────────────────────────────────────────────

export type TrackRemoveFromCartParams = {
  items: TrackingItem[] | CartLineItem[];
  value?: number;
};

export function trackRemoveFromCart({ items, value }: TrackRemoveFromCartParams) {
  const trackingItems = items.map((item) =>
    "item_id" in item ? item : cartLineToTrackingItem(item)
  );
  const total =
    value ??
    trackingItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  pushEcommerce("remove_from_cart", {
    value: total,
    items: trackingItems,
  });
}

// ── view_cart ───────────────────────────────────────────────────────────────

export function trackViewCart(items: CartLineItem[]) {
  pushEcommerce("view_cart", {
    value: cartValue(items),
    items: cartLinesToTrackingItems(items),
  });
}

// ── begin_checkout ──────────────────────────────────────────────────────────

export function trackBeginCheckout(items: CartLineItem[]) {
  pushEcommerce("begin_checkout", {
    value: cartValue(items),
    items: cartLinesToTrackingItems(items),
  });
}

// ── add_shipping_info ───────────────────────────────────────────────────────

export type TrackAddShippingInfoParams = {
  items: CartLineItem[];
  value?: number;
  coupon?: string | null;
  discount?: number | null;
  city?: string;
};

export function trackAddShippingInfo({
  items,
  value,
  coupon,
  discount,
  city,
}: TrackAddShippingInfoParams) {
  pushEcommerce(
    "add_shipping_info",
    {
      value: value ?? cartValue(items),
      coupon: coupon ?? undefined,
      discount: discount ?? undefined,
      shipping_tier: "standard",
      items: cartLinesToTrackingItems(items),
    },
    {
      ...(city ? { shipping_city: city } : {}),
      payment_provider: PAYMENT_PROVIDER,
    }
  );
}

// ── add_payment_info ────────────────────────────────────────────────────────

export type TrackAddPaymentInfoParams = {
  items: CartLineItem[];
  value?: number;
  coupon?: string | null;
  discount?: number | null;
  paymentType?: string;
  orderId?: string;
};

export function trackAddPaymentInfo({
  items,
  value,
  coupon,
  discount,
  paymentType = "hyp_pay",
  orderId,
}: TrackAddPaymentInfoParams) {
  pushEcommerce(
    "add_payment_info",
    {
      value: value ?? cartValue(items),
      coupon: coupon ?? undefined,
      discount: discount ?? undefined,
      payment_type: paymentType,
      items: cartLinesToTrackingItems(items),
    },
    {
      ...(orderId ? { order_id: orderId } : {}),
      payment_provider: PAYMENT_PROVIDER,
    }
  );
}

// ── purchase ────────────────────────────────────────────────────────────────

export type TrackPurchaseItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_category?: string;
  price: number;
  quantity: number;
};

export type TrackPurchaseParams = {
  transactionId: string;
  value: number;
  items: TrackPurchaseItem[];
  coupon?: string | null;
  discount?: number | null;
  shipping?: number;
  tax?: number;
};

export function trackPurchase({
  transactionId,
  value,
  items,
  coupon,
  discount,
  shipping = 0,
  tax = 0,
}: TrackPurchaseParams) {
  pushEcommerce(
    "purchase",
    {
      transaction_id: transactionId,
      value,
      shipping,
      tax,
      coupon: coupon ?? undefined,
      discount: discount ?? undefined,
      items: items.map((i) => ({
        ...i,
        item_brand: BRAND,
        currency: CURRENCY,
      })),
    },
    {
      order_id: transactionId,
      payment_provider: PAYMENT_PROVIDER,
    }
  );
}

// ── apply_coupon ────────────────────────────────────────────────────────────

export type TrackApplyCouponParams = {
  coupon: string;
  percentOff?: number;
  discountAmount?: number;
  value?: number;
};

export function trackApplyCoupon({
  coupon,
  percentOff,
  discountAmount,
  value,
}: TrackApplyCouponParams) {
  pushEvent("apply_coupon", {
    coupon,
    percent_off: percentOff,
    discount: discountAmount,
    discount_amount: discountAmount,
    value,
    currency: CURRENCY,
  });
}

export function trackCouponRejected(coupon: string, errorMessage?: string) {
  pushEvent("coupon_rejected", {
    coupon,
    error_message: errorMessage,
  });
}

// ── update_cart (qty change) ────────────────────────────────────────────────

export type TrackUpdateCartParams = {
  item: CartLineItem | TrackingItem;
  previousQuantity: number;
  quantity: number;
};

export function trackUpdateCart({
  item,
  previousQuantity,
  quantity,
}: TrackUpdateCartParams) {
  const trackingItem =
    "item_id" in item ? item : cartLineToTrackingItem(item);
  pushEcommerce(
    "update_cart",
    {
      value: trackingItem.price * quantity,
      items: [{ ...trackingItem, quantity }],
    },
    {
      previous_quantity: previousQuantity,
      quantity,
    }
  );
}

// ── payment_failed ──────────────────────────────────────────────────────────

export type TrackPaymentFailedParams = {
  orderId?: string | null;
  value?: number | null;
  ccode?: string | null;
  reason?: string;
};

export function trackPaymentFailed({
  orderId,
  value,
  ccode,
  reason,
}: TrackPaymentFailedParams) {
  pushEvent("payment_failed", {
    order_id: orderId ?? undefined,
    value: value ?? undefined,
    ccode: ccode ?? undefined,
    error_message: reason,
  });
}

// ── view_out_of_stock ───────────────────────────────────────────────────────

export type TrackViewOutOfStockParams = {
  sku: string;
  productId: string;
  productName: string;
  value: number;
  sizeLabel?: string;
  colorLabel?: string;
};

export function trackViewOutOfStock({
  sku,
  productId,
  productName,
  value,
  sizeLabel,
  colorLabel,
}: TrackViewOutOfStockParams) {
  pushEcommerce(
    "view_out_of_stock",
    {
      value,
      items: [
        {
          item_id: sku,
          item_name: productName,
          item_variant:
            [sizeLabel, colorLabel].filter(Boolean).join(" / ") || productId,
          price: value,
          quantity: 1,
          currency: CURRENCY,
        },
      ],
    },
    {
      product_id: productId,
      product_name: productName,
      sku,
      size_label: sizeLabel,
      color_label: colorLabel,
      in_stock: false,
    }
  );
}

// ── notify_me_stock ─────────────────────────────────────────────────────────

export type TrackNotifyMeStockParams = {
  sku: string;
  productId: string;
  productName: string;
  sizeLabel?: string;
  colorLabel?: string;
  bundleSku?: string;
};

export function trackNotifyMeStockOpen({
  sku,
  productId,
  productName,
  sizeLabel,
  colorLabel,
  bundleSku,
}: TrackNotifyMeStockParams) {
  pushEvent("notify_me_stock_open", {
    sku,
    product_id: productId,
    product_name: productName,
    size_label: sizeLabel,
    color_label: colorLabel,
    bundle_sku: bundleSku,
  });
}

export function trackNotifyMeStock({
  sku,
  productId,
  productName,
  sizeLabel,
  colorLabel,
  bundleSku,
}: TrackNotifyMeStockParams) {
  pushEvent("notify_me_stock", {
    sku,
    product_id: productId,
    product_name: productName,
    size_label: sizeLabel,
    color_label: colorLabel,
    bundle_sku: bundleSku,
  });
}

// ── Custom engagement ───────────────────────────────────────────────────────

export function trackWhatsAppClick(source: string) {
  pushEvent("whatsapp_click", { source });
}

export function trackCtaShop(source: string, href = "/feeder") {
  pushEvent("cta_shop", { source, link_url: href });
}

export function trackNavClick(params: {
  linkText: string;
  linkUrl: string;
  source?: string;
}) {
  pushEvent("nav_click", {
    link_text: params.linkText,
    link_url: params.linkUrl,
    source: params.source ?? "header",
  });
}

export function trackFaqOpen(params: {
  question: string;
  category: string;
  index: number;
}) {
  pushEvent("faq_open", {
    faq_question: params.question,
    faq_category: params.category,
    faq_index: params.index,
    content_name: params.question,
  });
}

export function trackViewPage(params: {
  pageType: string;
  pagePath?: string;
  pageTitle?: string;
}) {
  pushEvent("view_page", {
    page_type: params.pageType,
    page_path:
      params.pagePath ??
      (typeof window !== "undefined" ? window.location.pathname : undefined),
    page_title: params.pageTitle,
  });
}

export function trackCheckoutCancel(orderId?: string | null) {
  pushEvent("checkout_cancel", {
    order_id: orderId ?? undefined,
  });
}

export function trackNotifyMeStockError(params: {
  sku: string;
  productId: string;
  productName: string;
  errorMessage: string;
}) {
  pushEvent("notify_me_stock_error", {
    sku: params.sku,
    product_id: params.productId,
    product_name: params.productName,
    error_message: params.errorMessage,
  });
}

export function trackBundleToggle(enabled: boolean, productId: string) {
  pushEvent("bundle_toggle", {
    enabled,
    product_id: productId,
  });
}

export function trackCheckoutError(message: string, step?: string) {
  pushEvent("checkout_error", {
    error_message: message,
    checkout_step: step,
  });
}

export function trackRemoveCoupon(coupon: string) {
  pushEvent("remove_coupon", { coupon });
}

/**
 * Canonical event names fired by this app (Tracking Bible).
 * Used by scripts/generate_gtm.js to create GTM Custom Event triggers.
 */
export const TRACKING_EVENTS = [
  // Conversion
  "view_item",
  "select_item",
  "view_out_of_stock",
  "add_to_cart",
  "view_cart",
  "update_cart",
  "remove_from_cart",
  "begin_checkout",
  "apply_coupon",
  "coupon_rejected",
  "remove_coupon",
  "add_shipping_info",
  "add_payment_info",
  "purchase",
  "payment_failed",
  "checkout_cancel",
  "notify_me_stock_open",
  "notify_me_stock",
  "notify_me_stock_error",
  // Engagement
  "bundle_toggle",
  "whatsapp_click",
  "cta_shop",
  "nav_click",
  "faq_open",
  "view_page",
  // System
  "checkout_error",
] as const;

export type TrackingEventName = (typeof TRACKING_EVENTS)[number];

/**
 * Data Layer keys used across events (for GTM Data Layer Variables).
 */
export const DATA_LAYER_KEYS = [
  "value",
  "currency",
  "transaction_id",
  "order_id",
  "coupon",
  "discount",
  "discount_amount",
  "percent_off",
  "items",
  "num_items",
  "item_id",
  "item_name",
  "item_brand",
  "item_variant",
  "item_category",
  "price",
  "quantity",
  "previous_quantity",
  "sku",
  "product_id",
  "product_name",
  "size_label",
  "color_label",
  "bundle_sku",
  "is_bundle",
  "in_stock",
  "content_ids",
  "content_name",
  "content_type",
  "source",
  "link_url",
  "link_text",
  "faq_question",
  "faq_category",
  "faq_index",
  "page_type",
  "page_path",
  "page_title",
  "enabled",
  "error_message",
  "checkout_step",
  "ccode",
  "payment_provider",
  "payment_type",
  "shipping_city",
  "ecommerce",
  "ecommerce.value",
  "ecommerce.items",
  "ecommerce.transaction_id",
  "ecommerce.currency",
  "ecommerce.coupon",
  "ecommerce.discount",
] as const;
