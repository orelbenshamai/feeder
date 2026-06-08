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
  galleryImages: [],
  features: [
    {
      title: "קערות נירוסטה נשלפות",
      description:
        "שתי קערות כבדות, עמידות במדיח ונשלפות בקליק — ניקוי יומיומי בלי מאמץ.",
      imageUrl: "/media/medium_gray_1.png",
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
      imageUrl: "/media/medium_gray_2.png",
    },
  ],
  accordions: [
    {
      id: "size-chart",
      title: "טבלת גדלים",
      content:
        "קטן — מתאים לחתולים וכלבים עד 8 ק\"ג, זמין באפור ובז'. רגיל — הכי פופולרי, לכלבים עד 18 ק\"ג, זמין באפור. גדול — לכלבים בינוניים וגדולים עד 35 ק\"ג, בקרוב במלאי. כל הגדלים כוללים שתי קערות נירוסטה.",
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
      id: "gray",
      label: "אפור",
      hex: "#6B7280",
      imageUrl: "/media/small_gray_1.png",
    },
    {
      id: "beige",
      label: "בז'",
      hex: "#D4C4A8",
      imageUrl: "/media/small_beige_1.png",
    },
  ],
  variants: [
    {
      id: "small",
      sizeLabel: "קטן",
      price: 179,
      compareAtPrice: 249,
      imageUrl: "/media/small_gray_1.png",
      sku: "MSD-FEED-S",
      inStock: true,
      availableColors: ["gray", "beige"],
      galleryByColor: {
        gray: ["/media/small_gray_1.png", "/media/small_gray_2.png"],
        beige: ["/media/small_beige_1.png", "/media/small_beige_2.png"],
      },
    },
    {
      id: "medium",
      sizeLabel: "רגיל",
      price: 219,
      compareAtPrice: 289,
      imageUrl: "/media/medium_gray_1.png",
      sku: "MSD-FEED-M",
      inStock: true,
      availableColors: ["gray"],
      galleryByColor: {
        gray: [
          "/media/medium_gray_1.png",
          "/media/medium_gray_2.png",
          "/media/medium_gray_3.png",
        ],
      },
    },
    {
      id: "large",
      sizeLabel: "גדול",
      price: 249,
      compareAtPrice: 339,
      imageUrl: "/media/medium_gray_1.png",
      sku: "MSD-FEED-L",
      inStock: false,
      availableColors: ["gray"],
      galleryByColor: {
        gray: ["/media/medium_gray_1.png"],
      },
    },
  ],
};
