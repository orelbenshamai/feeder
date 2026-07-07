import { media } from "@/lib/media";
import { formatSizeDimensions } from "@/lib/size-dimensions";
import { toVimeoGalleryItem } from "@/lib/vimeo";
import type { Product } from "@/types/product";

const MAT_VIMEO_ID = "1201045944";

const MAT_GRAY_GALLERY = [
  media("mat_gray_1.png"),
  toVimeoGalleryItem(MAT_VIMEO_ID),
  media("mat_gray_2.png"),
  media("mat_gray_3.png"),
  media("mat_gray_4.png"),
];

export const mesudarMat: Product = {
  id: "prod_mesudar_mat_001",
  slug: "mesudar-mat",
  name: "משטח ההאכלה MESUDAR",
  category: "משטח ההאכלה",
  description:
    "מגן על הרצפה ממזון ומים שנשפכים — סיליקון בטוח, שוליים מוגבהים וניקוי קל.",
  highlights: [
    "מגן על הרצפה מנזקי מזון ומים",
    "שוליים מוגבהים בגובה 1.3 ס״מ — המים נשארים בתוך המשטח",
    "סיליקון נגד החלקה — המשטח לא זז בזמן האכלה",
    "מתקפל בקלות לאחסון או לנסיעות",
    "בטוח למדיח — מדף עליון",
    "סיליקון לא רעיל, בטוח למגע עם מזון",
  ],
  about:
    "אם חיית המחמד שלכם אוכלת או שותה בצורה מבולגנת — משטח ההאכלה MESUDAR שומר על הרצפה מפני נזקים. המשטח מונח ישירות מתחת לקערות ומונע מזון ומים שנשפכים, וגם התזות, מלהגיע לרצפה.\n\n" +
    "מה שמייחד את משטח ההאכלה MESUDAR ממשטחים אחרים הוא היקף מוגבה במיוחד — בגובה כ־1.3 ס״מ. השפה המוגבהת מכילה את המים, מונעת נזילה ושומרת על רצפה יבשה.\n\n" +
    "משטח ההאכלה MESUDAR עשוי מסיליקון נגד החלקה, כך שהוא לא מחליק בזמן שחיית המחמד נהנית מהארוחה. הניקוי פשוט: אפשר לקפל את המשטח, לזרוק שאריות מזון לפח, לשטוף במים חמים וסבון — או להכניס למדיח (מדף עליון).\n\n" +
    "הדרך הטובה ביותר למנוע בלגן סביב האוכל היא עמדת ההאכלה MESUDAR — אבל לפעמים, במיוחד אצל חיות מחמד עם פרווה ארוכה סביב הפה, נשארות טיפות כשהם הולכים משם. פשוט מניחים את משטח ההאכלה MESUDAR מול העמדה, והוא לוכד את הטיפות שנשארות בדרך.\n\n" +
    "משטח ההאכלה MESUDAR זמין בשלושה גדלים — מתאים לכל גודל קערות ולכל פינת אוכל בבית.\n\n" +
    "סביבת אכילה בריאה לחיית המחמד — ורצפה נקייה, יבשה ומוגנת לאורך זמן.",
  aboutTitle: "משטח ההאכלה MESUDAR",
  aboutCallout:
    "עמדת ההאכלה MESUDAR יחד עם משטח ההאכלה MESUDAR = האכלה בלי בלגן.",
  aboutCalloutAfter: 3,
  galleryImages: [],
  video: {
    vimeoId: MAT_VIMEO_ID,
    title: "משטח ההאכלה MESUDAR בפעולה",
  },
  features: [
    {
      title: "שוליים מוגבהים — מונע מים שנשפכים",
      description:
        "המשטח מתוכנן עם היקף מוגבה במדויק שלוכד מים שנשפכים ושאריות מזון ומונע מהן להגיע לרצפה. מתאים בדיוק לעמדת ההאכלה MESUDAR — מבטיח סביבת האכלה נקייה בכל פעם.",
      imageUrl: media("mat_feat_containment.png"),
    },
    {
      title: "סיליקון איכותי — בריא לחיית המחמד",
      description:
        "עשוי מסיליקון עמיד ואיכותי, בטוח למגע עם מזון. המגש יוצר משטח יציב שנשאר במקומו, עדין לרצפות, עמיד לחום ומותאם לשגרת היומיום של כל חיית מחמד.",
      imageUrl: media("mat_feat_quality.png"),
    },
    {
      title: "קל לניקוי - ניקוי במדיח",
      description:
        "בשגרה — שטיפה מהירה במים וסבון. לניקוי יסודי — פשוט לשים במדיח (מדף עליון). המשטח לא נשאר עם כתמים או ריחות, ונשמר נקי לאורך זמן.",
      imageUrl: media("mat_feat_clean.png"),
    },
  ],
  accordions: [
    {
      id: "size-chart",
      title: "טבלת גדלים",
      content:
        `קטן · ${formatSizeDimensions("41×26×1.3 ס״מ")}\nמתאים לפינת האכלה קומפקטית, קערות קטנות, חתולים וכלבים קטנים.\n\n` +
        `בינוני · ${formatSizeDimensions("49×31×1.3 ס״מ")}\nהכי פופולרי — מתאים לרוב קערות ביתיות סטנדרטיות.\n\n` +
        `גדול · ${formatSizeDimensions("61×41×1.3 ס״מ")}\nלקערות גדולות, כלבים בינוניים וגדולים, או לעמדת ההאכלה MESUDAR.`,
    },
    {
      id: "care",
      title: "תחזוקה ואחריות",
      content:
        "ניתן לשטוף במים וסבון או להכניס למדיח (מדף עליון). הסיליקון בטוח למגע עם מזון. אחריות יצרן לשנתיים. החזרה תוך 30 יום אם המוצר לא מתאים.",
    },
  ],
  colors: [
    {
      id: "gray",
      label: "אפור",
      hex: "#9CA3AF",
      imageUrl: media("mat_gray_1.png"),
    },
  ],
  variants: [
    {
      id: "small",
      sizeLabel: "קטן",
      sizeDimensions: "41×26×1.3 ס״מ",
      price: 0, // overridden by inventory
      compareAtPrice: 0,
      imageUrl: media("mat_gray_1.png"),
      sku: "MSD-MAT-S",
      inStock: true,
      availableColors: ["gray"],
      galleryByColor: {
        gray: MAT_GRAY_GALLERY,
      },
    },
    {
      id: "medium",
      sizeLabel: "בינוני",
      sizeDimensions: "49×31×1.3 ס״מ",
      price: 0, // overridden by inventory
      compareAtPrice: 0,
      imageUrl: media("mat_gray_1.png"),
      sku: "MSD-MAT-M",
      inStock: true,
      availableColors: ["gray"],
      galleryByColor: {
        gray: MAT_GRAY_GALLERY,
      },
    },
    {
      id: "large",
      sizeLabel: "גדול",
      sizeDimensions: "61×41×1.3 ס״מ",
      price: 0, // overridden by inventory
      compareAtPrice: 0,
      imageUrl: media("mat_gray_1.png"),
      sku: "MSD-MAT-L",
      inStock: true,
      availableColors: ["gray"],
      galleryByColor: {
        gray: MAT_GRAY_GALLERY,
      },
    },
  ],
};
