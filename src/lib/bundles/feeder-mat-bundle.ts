import { media } from "@/lib/media";
import type { BundleUpsellOffer } from "@/types/product";

/** Feeder PDP → silicone mat upsell configuration. */
export const FEEDER_MAT_BUNDLE: BundleUpsellOffer = {
  id: "feeder-mat",
  matProductId: "prod_mesudar_mat_001",
  matColorId: "gray",
  matColorLabel: "אפור",
  checkboxLabel: "הוסיפו הגנה מלאה — עמדה + משטח",
  checkboxHint: "העמדה עוצרת 90% מהבלגן — המשטח לוכד את השאר",
  bundleLabel: "חבילת הגנה מלאה — עמדת האכלה + משטח האכלה",
  addonName: "משטח האכלה MESUDAR",
  addonTagline: "ההגנה האחרונה — לוכד מה שהעמדה לא תופסת",
  bannerLabel: "ההגנה המלאה — עמדה + משטח",
  bannerCheckedLabel: "ההגנה המלאה על הרצפה בהזמנה",
  ctaLabel: "הוסיפו את המשטח",
  bundleProductCategory: "עמדת האכלה ומשטח האכלה",
  benefits: [
    "העמדה עוצרת 90% מהבלגן — המשטח לוכד את השאר",
    "הגנה כפולה: מים שנשפכים + שאריות שמתגלגלות",
    "חיסכון בחבילה — פחות ממחיר קנייה נפרדת",
  ],
  // Prices are hydrated from MongoDB at runtime via hydrateBundleOffer()
  addonPriceBySize:    { small: 0, medium: 0, large: 0 },
  matRetailPriceBySize: { small: 0, medium: 0, large: 0 },
  matSkuBySize: {
    small: "MSD-MAT-S",
    medium: "MSD-MAT-M",
    large: "MSD-MAT-L",
  },
  bundleSkuBySize: {
    small: "MSD-BUNDLE-S",
    medium: "MSD-BUNDLE-M",
    large: "MSD-BUNDLE-L",
  },
  bundleImageBySize: {
    small: media("small_gray_1.png"),
    medium: media("medium_gray_1.png"),
    large: media("medium_gray_1.png"),
  },
  matImageBySize: {
    small: media("mat_gray_1.png"),
    medium: media("mat_gray_1.png"),
    large: media("mat_gray_1.png"),
  },
};
