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
    "סוף לניגוב הרצפה אחרי כל ארוחה — עמדת ההאכלה MESUDAR לוכדת מזון ומים בפנים, לפני שהם מגיעים לרצפה.",
  highlights: [
    "הרצפה נשארת יבשה — מים שנשפכים נאספים באגן תחתון, לא על הריצוף",
    "שאריות מזון נשארות בתוך העמדה — לא מתפזרות בכל המטבח",
    "עובד לכלבים ולחתולים — גם השותים בצורה מבולגנת, גם הדוחפים קערות",
    "קירות מוגבהים עוצרים התזות — גם ארוחה נלהבת לא מגיעה לרצפה",
    "קערות נירוסטה נשלפות — ישר למדיח, ניקוי של 10 שניות",
    "רגליות סיליקון יציבות — העמדה לא זזה, הקערות לא מתגלגלות",
  ],
  about:
    "נמאס לנגב את הרצפה פעמיים ביום? זה לא בעיה שלכם — זו בעיה של העמדה הישנה. עמדת ההאכלה MESUDAR תוכננה מהיסוד כדי לעצור את הבלגן לפני שהוא יוצא החוצה.\n\n" +
    "הבעיה הכי נפוצה היא מים. כלב ששותה בהתלהבות, חתול שדוחף את הקערה — וברגע אחד יש שלולית על הריצוף. עמדת MESUDAR פותרת את זה עם ניקוז חכם: מים שנשפכים זורמים דרך שיפוע מובנה, עוברים חורי סינון שמונעים כניסת פירורים, ונאספים באגן תחתון נפרד. הרצפה נשארת יבשה.\n\n" +
    "שאריות מזון זה סיפור אחר — כדורי יבש שמתגלגלים, לחה שמתפזרת. המגש המוגבה של MESUDAR מכיל את הכול סביב הקערות. לא על הרצפה, לא מתחת לתנור.\n\n" +
    "הקירות המוגבהים סביב הקערות עושים את ההפרש: גם ארוחה נלהבת, גם כלב שמנער את הראש תוך כדי שתייה — ההתזות נעצרות בפנים. הרצפה מסביב נשארת יבשה.\n\n" +
    "עמדת ההאכלה MESUDAR עובדת לכלבים ולחתולים. לא משנה אם חיית המחמד שלכם שותה בצורה מבולגנת, דוחפת קערות, או פשוט אוכלת מהר — העמדה לוכדת הכול בפנים.\n\n" +
    "הניקוי לוקח 10 שניות: שתי קערות נירוסטה נשלפות ישר למדיח. את האגן שוטפים ידנית פעם בכמה ימים. זהו.\n\n" +
    "פחות ניגוב. פחות סיכון להחלקה על רצפה רטובה. פחות נזק לריצוף לאורך זמן.",
  aboutTitle: "עמדת ההאכלה MESUDAR",
  aboutCallout:
    "הרצפה תישאר נקייה — מובטח. עמדת MESUDAR עוצרת את הבלגן לפני שהוא יוצא.",
  aboutCalloutAfter: 2,
  galleryImages: [],
  features: [
    {
      title: "מים שנשפכים? נשארים בפנים",
      description:
        "ניקוז חכם עם שיפוע מובנה וחורי סינון מוביל מים ישר לאגן איסוף תחתון. גם כלב שמרטיב חצי מטבח, גם חתול שדוחף קערה — הרצפה יוצאת יבשה.",
      imageUrl: media("feeder_feat_no_mess.png"),
    },
    {
      title: "שאריות מזון לא מגיעות לרצפה",
      description:
        "המגש המוגבה והקירות סביב הקערות לוכדים כדורי יבש, לחה ושאריות לפני שהן מתפזרות. פחות ניגוב, פחות שאריות מתחת לתנור.",
      imageUrl: media("feeder_feat_agronomics.png"),
    },
    {
      title: "ניקוי של 10 שניות — לא 10 דקות",
      description:
        "קערות נירוסטה נשלפות ישר למדיח. האגן שוטפים ידנית פעם בכמה ימים. זהו — לא עוד ניגוב יומיומי של הרצפה.",
      imageUrl: media("feeder_feat_bowls.png"),
    },
  ],
  accordions: [
    {
      id: "size-chart",
      title: "טבלת גדלים",
      content:
        `קטן · ${formatSizeDimensions("33×22×14 ס״מ")}\nלחתולים וכלבים עד 8 ק"ג · גם לשותים הכי מבולגנים · אפור ובז'\n\n` +
        `רגיל · ${formatSizeDimensions("42×28×16 ס״מ")}\nהכי פופולרי — לכלבים עד 18 ק"ג · מכיל כמות מים משמעותית\n\n` +
        `גדול · ${formatSizeDimensions("50×34×18 ס״מ")}\nלכלבים בינוניים וגדולים עד 35 ק"ג · לבלגן הגדול בהתאם\n\n` +
        "כל הגדלים כוללים שתי קערות נירוסטה ואגן איסוף.",
    },
    {
      id: "care",
      title: "תחזוקה ואחריות",
      content:
        "קערות — ישר למדיח. מגש ואגן — שטיפה ידנית עם מים וסבון עדין, פעם בכמה ימים.\n\nאחריות יצרן לשנתיים · החזרה תוך 30 יום אם הרצפה עדיין מלוכלכת.",
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
