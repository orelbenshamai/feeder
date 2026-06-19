import { media } from "@/lib/media";
import type { BundleUpsellOffer } from "@/types/product";

/** Feeder PDP → silicone mat upsell configuration. */
export const FEEDER_MAT_BUNDLE: BundleUpsellOffer = {
  id: "feeder-mat-bundle",
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
  benefits: [
    "העמדה עוצרת 90% מהבלגן — המשטח לוכד את השאר",
    "הגנה כפולה: מים שנשפכים + שאריות שמתגלגלות",
    "חיסכון בחבילה — פחות ממחיר קנייה נפרדת",
  ],
  addonPriceBySize: {
    small: 79,
    medium: 89,
    large: 99,
  },
  matRetailPriceBySize: {
    small: 99,
    medium: 119,
    large: 139,
  },
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
