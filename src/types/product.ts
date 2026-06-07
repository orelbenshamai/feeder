/** Size identifiers — stable across mock data and future MongoDB documents. */
export type ProductSizeId = "small" | "medium" | "large";

/** Finish / color identifiers — stable across mock data and future MongoDB documents. */
export type ProductColorId = "navy" | "slate" | "cream";

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
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  sku: string;
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

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  about: string;
  galleryImages: string[];
  features: ProductFeature[];
  accordions: ProductAccordion[];
  colors: ProductColor[];
  variants: ProductVariant[];
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
}
