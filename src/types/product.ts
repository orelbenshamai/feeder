/** Size identifiers — stable across mock data and future MongoDB documents. */
export type ProductSizeId = "small" | "medium" | "large";

/** Finish / color identifiers — stable across mock data and future MongoDB documents. */
export type ProductColorId = "gray" | "beige";

export interface ProductColor {
  id: ProductColorId;
  /** Display label, e.g. "כחול כהה" */
  label: string;
  /** Swatch fill */
  hex: string;
  /** Optional hero / gallery image for this finish */
  imageUrl?: string;
}

export interface ProductVariant {
  id: ProductSizeId;
  /** Display label, e.g. "Small" / "קטן" */
  sizeLabel: string;
  /** Footprint + height for the size selector, e.g. "42×28×16 ס״מ" (רוחב×אורך×גובה). */
  sizeDimensions?: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  sku: string;
  inStock: boolean;
  /** Colors offered for this size */
  availableColors: ProductColorId[];
  /** Gallery slides keyed by finish */
  galleryByColor: Partial<Record<ProductColorId, string[]>>;
}

export interface ProductFeature {
  title: string;
  description: string;
  imageUrl: string;
}

export interface ProductAccordion {
  id: string;
  title: string;
  content: string;
}

export interface ProductVideo {
  vimeoId: string;
  title: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  about: string;
  /** Optional heading above the about panel body copy. */
  aboutTitle?: string;
  /** Optional prominent line in the about panel (shown after `aboutCalloutAfter`). */
  aboutCallout?: string;
  /** 0-based paragraph index after which to show `aboutCallout`. */
  aboutCalloutAfter?: number;
  /** Optional PDP bullet highlights (e.g. mat product page). */
  highlights?: string[];
  galleryImages: string[];
  features: ProductFeature[];
  accordions: ProductAccordion[];
  colors: ProductColor[];
  variants: ProductVariant[];
  /** Optional Vimeo clip shown in the gallery and a dedicated PDP section. */
  video?: ProductVideo;
}

export interface CartBundleComponent {
  productId: string;
  sku: string;
  sizeId: ProductSizeId;
  sizeLabel: string;
  colorId: ProductColorId;
  colorLabel: string;
  unitPrice: number;
}

export interface CartLineItem {
  productId: string;
  sku: string;
  sizeId: ProductSizeId;
  sizeLabel: string;
  colorId: ProductColorId;
  colorLabel: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  /** Present when the line item is a feeder + mat bundle. */
  bundleSku?: string;
  bundleLabel?: string;
  bundleComponents?: CartBundleComponent[];
}

/** Optional mat upsell shown on the feeder PDP. */
export interface BundleUpsellOffer {
  id: string;
  matProductId: string;
  matColorId: ProductColorId;
  matColorLabel: string;
  checkboxLabel: string;
  checkboxHint: string;
  bundleLabel: string;
  addonPriceBySize: Record<ProductSizeId, number>;
  matRetailPriceBySize: Record<ProductSizeId, number>;
  matSkuBySize: Record<ProductSizeId, string>;
  bundleSkuBySize: Record<ProductSizeId, string>;
  /** Full bundle hero image (gallery / cart when bundle selected). */
  bundleImageBySize: Record<ProductSizeId, string>;
  /** Mat-only image shown on the upsell card. */
  matImageBySize: Record<ProductSizeId, string>;
}
