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
    "הרצפה נשארת יבשה — מים שנשפכים נאספים במיכל התחתון, לא על הרצפה",
    "שאריות מזון נשארות בתוך העמדה — לא מתפזרות על הרצפה",
    "עובד לכלבים ולחתולים — גם כאלו ששותים בצורה מבולגנת, וגם כאלו שדוחפים קערות",
    "קירות מוגבהים עוצרים התזות — גם כאלו שאוכלים בצורה מבולגנת, וגם כאלו שמנערים את הראש תוך כדי שתייה",
    "קערות נירוסטה נשלפות — ישר למדיח, ניקוי של 10 שניות",
    "רגליות סיליקון יציבות — העמדה לא זזה",
  ],
  about:
    "## hook\n\nנמאס לנקות אחרי חיית המחמד שלכם אחרי שהיא אוכלת ושותה?\n\n" +
    "עמדת ההאכלה MESUDAR תוכננה מהיסוד כדי לעצור את הבלגן לפני שהוא יוצא החוצה לעבר הרצפה שלכם.\n\n" +
    "## מים\n\n" +
    "כלב ששותה בהתלהבות, חתול שדוחף את הקערה — וברגע אחד יש שלולית על הרצפה. עמדת MESUDAR פותרת את זה עם ניקוז חכם: מים שנשפכים זורמים דרך שיפוע מובנה, עוברים חורי סינון שמונעים כניסת מזון, ונאספים במיכל תחתון נפרד. הרצפה נשארת יבשה.\n\n" +
    "## שאריות מזון\n\n" +
    "הקירות המוגבהים סביב הקערות לוכדים את מה שנשאר — גם ארוחה נלהבת, גם ניעור ראש בזמן שתייה. שאריות נשארות בפנים, לא על הרצפה.\n\n" +
    "**הניקוי לוקח 10 שניות — לא 10 דקות.** שתי קערות נירוסטה איכותיות נשלפות ישר למדיח. את המיכל שוטפים ידנית פעם בכמה ימים. זהו.",
  aboutTitle: "עמדת ההאכלה MESUDAR",
  aboutCallout:
    "הרצפה תישאר נקייה — מובטח. עמדת MESUDAR עוצרת את הבלגן לפני שהוא יוצא.",
  aboutCalloutAfter: 2,
  galleryImages: [],
  features: [
    {
      title: "מים שנשפכים? נשארים בפנים",
      description:
        "ניקוז חכם עם שיפוע מובנה וחורי סינון מובילים מים ישר למיכל תחתון. גם כלב שמרטיב חצי מטבח, גם חתול שדוחף קערה — הרצפה נשארת יבשה.",
      imageUrl: media("feeder_feat_no_mess.png"),
    },
    {
      title: "שאריות מזון לא מגיעות לרצפה",
      description:
        "הקירות סביב הקערות לוכדים שאריות מזון ומים לפני שהם מגיעים לרצפה. פחות ניגוב, פחות שאריות מזון על הרצפה.",
      imageUrl: media("feeder_feat_agronomics.png"),
    },
    {
      title: "ניקיון של 10 שניות — לא 10 דקות",
      description:
        "קערות נירוסטה שנשלפות בקלות ישר למדיח. את העמדה עצמה שוטפים ידנית פעם בכמה ימים. זהו — לא עוד ניקיון יומיומי של הרצפה.",
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
        "כל הגדלים כוללים שתי קערות נירוסטה",
    },
    {
      id: "care",
      title: "תחזוקה ואחריות",
      content:
        "קערות — ישר למדיח. מגש ומיכל תחתון — שטיפה ידנית עם מים וסבון עדין, פעם בכמה ימים.\n\nאחריות יצרן לשנתיים · החזרה תוך 30 יום אם הרצפה עדיין מלוכלכת.",
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
