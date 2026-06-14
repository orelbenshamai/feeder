import { media } from "@/lib/media";
import { formatSizeDimensions } from "@/lib/size-dimensions";
import type { Product } from "@/types/product";

/**
 * Mock catalog entry — swap the fetch layer in `@/lib/products` for MongoDB
 * without changing UI components.
 */
export const mesudarFeederStation: Product = {
  id: "prod_mesudar_feeder_001",
  slug: "mesudar-feeder-station",
  name: "עמדת ההאכלה MESUDAR",
  category: "עמדת ההאכלה",
  description:
    "עמדת ההאכלה פרימיום עם מגש לאיסוף נזילות והישפכות, קערות נירוסטה נשלפות וניקוז חכם.",
  about:
    "עמדת ההאכלה MESUDAR נבנתה כדי לעצור את הבלגן היומיומי סביב האוכל — שאריות, התזות ורטיבות שלא מגיעות יותר לרצפה. המגש המשופע לוכד שאריות, מערכת הניקוז מעבירה נוזלים לאגן האיסוף, וקערות הנירוסטה נשלפות בשנייה ונכנסות למדיח. שלושה גדלים לחתולים, כלבים קטנים וגדולים — עם רגליות סיליקון יציבות שלא מחליקות על הרצפה.",
  galleryImages: [],
  features: [
    {
      title: "נוחות מוגבהת — עיכול בריא יותר",
      description:
        "גובה העמדה תוכנן לשמור על יציבה נכונה של חיית המחמד, ולהפחית עומס על הצוואר והמפרקים בזמן הארוחה. מיקום הקערות בזווית נוחה שמעודד עיכול טבעי.",
      imageUrl: media("feeder_feat_agronomics.png"),
    },
    {
      title: "עיצוב חכם — רצפה נקייה",
      description:
        "להתראות לבלגן סביב קערות האוכל. העמדה יציבה ומדויקת, ומשתלבת עם משטח ההאכלה MESUDAR. כל פרט מעוצב ללכוד מזון ומים שנשפכים והתזות — כך שהרצפה נשארת נקייה.",
      imageUrl: media("feeder_feat_no_mess.png"),
    },
    {
      title: "קערות נירוסטה — בריא לחיית המחמד",
      description:
        "קערות הנירוסטה שמגיעות עם העמדה עמידות בפני חלודה, בטוחות למגע עם מזון ומתאימות למדיח. סביבת אכילה היגיינית ונקייה — לבריאות ולביטחון של חיית המחמד.",
      imageUrl: media("feeder_feat_bowls.png"),
    },
  ],
  accordions: [
    {
      id: "size-chart",
      title: "טבלת גדלים",
      content:
        `קטן · ${formatSizeDimensions("33×22×14 ס״מ")}\nמתאים לחתולים וכלבים עד 8 ק\"ג · זמין באפור ובז'\n\n` +
        `רגיל · ${formatSizeDimensions("42×28×16 ס״מ")}\nהכי פופולרי — לכלבים עד 18 ק\"ג · זמין באפור\n\n` +
        `גדול · ${formatSizeDimensions("50×34×18 ס״מ")}\nלכלבים בינוניים וגדולים עד 35 ק\"ג · בקרוב במלאי\n\n` +
        "כל הגדלים כוללים שתי קערות נירוסטה.",
    },
    {
      id: "care",
      title: "תחזוקה ואחריות",
      content:
        "הקערות — ישר למדיח. את המגש והאגן מומלץ לשטוף ידנית במים וסבון עדין.\n\nאחריות יצרן לשנתיים · החזרה תוך 30 יום אם המוצר לא מתאים.",
    },
  ],
  colors: [
    {
      id: "gray",
      label: "אפור",
      hex: "#6B7280",
      imageUrl: media("small_gray_1.png"),
    },
    {
      id: "beige",
      label: "בז'",
      hex: "#D4C4A8",
      imageUrl: media("small_beige_1.png"),
    },
  ],
  variants: [
    {
      id: "small",
      sizeLabel: "קטן",
      sizeDimensions: "33×22×14 ס״מ",
      price: 179,
      compareAtPrice: 249,
      imageUrl: media("small_gray_1.png"),
      sku: "MSD-FEED-S",
      inStock: false,
      availableColors: ["gray", "beige"],
      galleryByColor: {
        gray: [media("small_gray_1.png"), media("small_gray_2.png")],
        beige: [media("small_beige_1.png"), media("small_beige_2.png")],
      },
    },
    {
      id: "medium",
      sizeLabel: "רגיל",
      sizeDimensions: "42×28×16 ס״מ",
      price: 219,
      compareAtPrice: 289,
      imageUrl: media("medium_gray_1.png"),
      sku: "MSD-FEED-M",
      inStock: false,
      availableColors: ["gray"],
      galleryByColor: {
        gray: [
          media("medium_gray_1.png"),
          media("medium_gray_2.png"),
          media("medium_gray_3.png"),
        ],
      },
    },
    {
      id: "large",
      sizeLabel: "גדול",
      sizeDimensions: "50×34×18 ס״מ",
      price: 249,
      compareAtPrice: 339,
      imageUrl: media("medium_gray_1.png"),
      sku: "MSD-FEED-L",
      inStock: false,
      availableColors: ["gray"],
      galleryByColor: {
        gray: [media("medium_gray_1.png")],
      },
    },
  ],
};
