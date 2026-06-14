import type { Product, ProductColor, ProductVariant } from "@/types/product";

/** Shape we expect from MongoDB — adjust field names when the schema is final. */
export type MongoProductDocument = {
  _id: string;
  slug: string;
  name: string;
  category?: string;
  description: string;
  about?: string;
  galleryImages?: string[];
  features?: Product["features"];
  accordions?: Product["accordions"];
  colors?: ProductColor[];
  variants: Array<{
    sizeId: ProductVariant["id"];
    sizeLabel: string;
    sizeDimensions?: string;
    price: number;
    compareAtPrice?: number;
    imageUrl: string;
    sku: string;
    inStock?: boolean;
    availableColors?: ProductVariant["availableColors"];
    galleryByColor?: ProductVariant["galleryByColor"];
  }>;
};

export function mapMongoProduct(doc: MongoProductDocument): Product {
  return {
    id: doc._id,
    slug: doc.slug,
    name: doc.name,
    category: doc.category ?? "Product",
    description: doc.description,
    about: doc.about ?? doc.description,
    galleryImages: doc.galleryImages ?? [],
    features: doc.features ?? [],
    accordions: doc.accordions ?? [],
    colors: doc.colors ?? [],
    variants: doc.variants.map((v) => ({
      id: v.sizeId,
      sizeLabel: v.sizeLabel,
      sizeDimensions: v.sizeDimensions,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      imageUrl: v.imageUrl,
      sku: v.sku,
      inStock: v.inStock ?? true,
      availableColors: v.availableColors ?? [],
      galleryByColor: v.galleryByColor ?? {},
    })),
  };
}
