import type { Product } from "@/types/product";

/**
 * Mock catalog entry — swap the fetch layer in `@/lib/products` for MongoDB
 * without changing UI components.
 */
export const mesudarFeederStation: Product = {
  id: "prod_mesudar_feeder_001",
  slug: "mesudar-feeder-station",
  name: "עמדת ההאכלה החכמה",
  category: "עמדת האכלה",
  description:
    "עמדת האכלה פרימיום עם מגש נגד שפיכות, קערות נירוסטה נשלפות וניקוז חכם.",
  about:
    "עמדת מסודר נועדה לפתור את הבלגן היומיומי סביב קערות האוכל: שאריות, התזות ורטיבות על הרצפה. המגש העליון משופע ולוכד את השאריות, חורי הניקוז מובילים את הנוזלים לאגן האיסוף התחתון, והקערות מנירוסטה כבדה נשלפות בשנייה לניקוי במדיח. שלושה גדלים מותאמים לחתולים, כלבים קטנים וכלבים גדולים — עם רגליות סיליקון שמונעות החלקה ושומרות על הרצפה.",
  galleryImages: [
    "/media/product_image.png",
    "/media/product_breakdown.png",
    "/media/final_cta_img.png",
  ],
  features: [
    {
      title: "קערות נירוסטה נשלפות",
      description:
        "שתי קערות כבדות, עמידות במדיח ונשלפות בקליק — ניקוי יומיומי בלי מאמץ.",
      imageUrl: "/media/product_image.png",
    },
    {
      title: "ניקוז חכם",
      description:
        "משטח משופע וחורי ניקוז בחזית מובילים את כל הנוזלים לאגן האיסוף התחתון.",
      imageUrl: "/media/product_breakdown.png",
    },
    {
      title: "יציבות מלאה",
      description:
        "רגליות סיליקון נגד החלקה שומרות על העמדה במקום ומגנות על הרצפה.",
      imageUrl: "/media/final_cta_img.png",
    },
  ],
  accordions: [
    {
      id: "size-chart",
      title: "טבלת גדלים",
      content:
        "קטן — מתאים לחתולים וכלבים עד 8 ק\"ג. רגיל — הכי פופולרי, לכלבים עד 18 ק\"ג. גדול — לכלבים בינוניים וגדולים עד 35 ק\"ג. כל הגדלים כוללים שתי קערות נירוסטה.",
    },
    {
      id: "care",
      title: "תחזוקה ואחריות",
      content:
        "ניתן לשטוף את הקערות במדיח. את המגש והאגן מומלץ לשטוף ידנית עם מים וסבון עדין. אחריות יצרן לשנתיים. החזרה תוך 30 יום אם המוצר לא מתאים.",
    },
  ],
  colors: [
    {
      id: "navy",
      label: "כחול כהה",
      hex: "#1F3A52",
      imageUrl: "/media/product_image.png",
    },
    {
      id: "slate",
      label: "אפור-כחול",
      hex: "#52728C",
      imageUrl: "/media/product_breakdown.png",
    },
    {
      id: "cream",
      label: "קרם",
      hex: "#F7F5F0",
      imageUrl: "/media/final_cta_img.png",
    },
  ],
  variants: [
    {
      id: "small",
      sizeLabel: "קטן",
      price: 179,
      compareAtPrice: 249,
      imageUrl: "/media/product_image.png",
      sku: "MSD-FEED-S",
    },
    {
      id: "medium",
      sizeLabel: "רגיל",
      price: 219,
      compareAtPrice: 289,
      imageUrl: "/media/product_image.png",
      sku: "MSD-FEED-M",
    },
    {
      id: "large",
      sizeLabel: "גדול",
      price: 249,
      compareAtPrice: 339,
      imageUrl: "/media/product_breakdown.png",
      sku: "MSD-FEED-L",
    },
  ],
};
