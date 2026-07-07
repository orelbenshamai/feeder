import { media } from "@/lib/media";
import type { BundleUpsellOffer } from "@/types/product";

/** Mat PDP → feeder station upsell configuration. */
export const MAT_FEEDER_BUNDLE: BundleUpsellOffer = {
  id: "feeder-mat",
  matProductId: "prod_mesudar_feeder_001",
  matColorId: "gray",
  matColorLabel: "אפור",
  checkboxLabel: "הוסיפו עמדת האכלה — עצרו את הבלגן במקור",
  checkboxHint: "עמדת MESUDAR עוצרת 90% מהבלגן לפני שהוא מגיע לרצפה",
  bundleLabel: "חבילת הגנה מלאה — עמדת האכלה + משטח האכלה",
  addonName: "עמדת האכלה MESUDAR",
  addonTagline: "עוצרת את הבלגן במקור — לפני שהוא מגיע למשטח",
  bannerLabel: "ההגנה המלאה — עמדה + משטח",
  bannerCheckedLabel: "ההגנה המלאה על הרצפה בהזמנה",
  ctaLabel: "הוסיפו את העמדה",
  bundleProductCategory: "משטח האכלה ועמדת האכלה",
  benefits: [
    "העמדה עוצרת 90% מהבלגן — המשטח לוכד את השאר",
    "מים שנשפכים נשארים בפנים — לא מגיעים כלל למשטח",
    "חיסכון בחבילה — פחות ממחיר קנייה נפרדת",
  ],
  // Prices are hydrated from MongoDB at runtime via hydrateBundleOffer()
  addonPriceBySize:    { small: 0, medium: 0, large: 0 },
  matRetailPriceBySize: { small: 0, medium: 0, large: 0 },
  matSkuBySize: {
    small: "MSD-FEED-S",
    medium: "MSD-FEED-M",
    large: "MSD-FEED-L",
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
    small: media("small_gray_1.png"),
    medium: media("medium_gray_1.png"),
    large: media("medium_gray_1.png"),
  },
};
