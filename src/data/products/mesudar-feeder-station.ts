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
    "עמדת האכלה מוגבהת ששומרת על הרצפה יבשה — שאריות מזון במגש, מים באגן תחתון, קערות נירוסטה למדיח.",
  highlights: [
    "שאריות מזון נשארות במגש העליון — מים שנשפכים זורמים לאגן האיסוף",
    "קירות מוגבהים וניקוז חכם — מונעים התזות, נזילות ורטיבות על הרצפה",
    "עמדה מוגבהת — עיכול נוח יותר ופחות עומס על הצוואר והמפרקים",
    "קערות נירוסטה נשלפות — ניקוי קל, מתאימות למדיח",
    "רגליות סיליקון יציבות — העמדה לא זזה ולא מחליקה בזמן האכלה",
    "ניקוי מהיר — שטיפה במים וסבון או הכנסה למדיח",
  ],
  about:
    "אם חיית המחמד שלכם אוכלת בצורה מבולגנת — עמדת ההאכלה MESUDAR שומרת על הבית נקי. העמדה תוכננה כדי לעצור את הבלגן היומיומי סביב האוכל: שאריות מזון, התזות ומים שנשפכים — בלי שזה מגיע לרצפה.\n\n" +
    "שאריות המזון נשארות במגש העליון סביב הקערות. מים שנשפכים זורמים במורד שיפוע עדין בחזית העמדה, עוברים דרך חורי סינון שמונעים כניסת פירורים, ונאספים באגן מים תחתון נפרד.\n\n" +
    "הקירות המוגבהים סביב הקערות פועלים כמגן התזות — כך שגם שתייה נלהבת, בעיטה בטעות או ילד שעובר ליד לא מפזרים מים על הרצפה.\n\n" +
    "כשהמזון והמים נשארים בתוך העמדה, הרצפה נשארת יבשה — פחות ניקוי, פחות סיכון להחלקה, ופחות נזק לריצוף. העמדה גם מוגבהת: גובה נוח שמקל על העיכול ומפחית עומס על הצוואר והמפרקים בזמן הארוחה.\n\n" +
    "שתי קערות נירוסטה נשלפות בשנייה, בטוחות למגע עם מזון, עמידות בפני חלודה ומתאימות למדיח. את המגש ואגן האיסוף מומלץ לשטוף במים וסבון — לניקוי יומיומי מהיר.\n\n" +
    "עמדת ההאכלה MESUDAR זמינה בשלושה גדלים — לחתולים, כלבים קטנים ובינוניים וגדולים. רגליות הסיליקון שומרות על יציבות גם על ריצוף חלק.\n\n" +
    "סביבת אכילה נקייה, יבשה ונוחה לחיית המחמד — ורצפה שנשארת מסודרת לאורך זמן.",
  aboutTitle: "עמדת ההאכלה MESUDAR",
  aboutCallout:
    "עמדת ההאכלה MESUDAR יחד עם משטח ההאכלה MESUDAR = האכלה בלי בלגן.",
  aboutCalloutAfter: 2,
  galleryImages: [],
  features: [
    {
      title: "ניקוז חכם — מזון למעלה, מים למטה",
      description:
        "המגש המשופע לוכד שאריות מזון במקום. מים שנשפכים זורמים דרך חורי ניקוז לאגן איסוף תחתון — הרצפה נשארת יבשה גם אחרי ארוחות מבולגנות.",
      imageUrl: media("feeder_feat_no_mess.png"),
    },
    {
      title: "עמדה מוגבהת — עיכול ובריאות המפרקים",
      description:
        "גובה העמדה תוכנן לשמור על יציבה נכונה של חיית המחמד, להקל על העיכול ולהפחית עומס על הצוואר והמפרקים. מיקום נוח שמעודד אכילה רגועה וטבעית.",
      imageUrl: media("feeder_feat_agronomics.png"),
    },
    {
      title: "קערות נירוסטה — ניקוי קל, מתאים למדיח",
      description:
        "שתי קערות נירוסטה נשלפות בשנייה, בטוחות למגע עם מזון ועמידות בפני חלודה. נכנסות ישר למדיח — סביבת אכילה היגיינית לכל יום.",
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
        `גדול · ${formatSizeDimensions("50×34×18 ס״מ")}\nלכלבים בינוניים וגדולים עד 35 ק\"ג · זמין באפור\n\n` +
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
