import type { Metadata } from "next";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["latin", "hebrew"],
  display: "swap",
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "מסודר — רצפה יבשה, האכלה נקייה",
  description:
    "עמדת האכלה שמונעת רטיבות ופיזור מזון. שרינו הנחת השקה של 10%, משלוחים לכל הארץ ואחריות מלאה.",
  icons: {
    icon: [{ url: "/media/logo_sym.png", type: "image/png" }],
    apple: [{ url: "/media/logo_sym.png", type: "image/png" }],
    shortcut: "/media/logo_sym.png",
  },
  openGraph: {
    title: "מסודר — רצפה יבשה, האכלה נקייה",
    description:
      "מוצרים להאכלה נקייה בבית: רצפה יבשה, פחות בלגן, תמיכה אנושית בוואטסאפ.",
    type: "website",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${frankRuhl.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink selection:bg-ink selection:text-cream">
        {children}
      </body>
    </html>
  );
}
