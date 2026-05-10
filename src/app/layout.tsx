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
  title: "מסודר — בלי מים ואוכל על הרצפה",
  description:
    "עמדת האכלה מוגבהת לפינת אוכל נקייה ומסודרת. משלוח מהיר בישראל.",
  openGraph: {
    title: "מסודר — בלי מים ואוכל על הרצפה",
    description: "פתרון האכלה לבית מסודר. עמדה מוגבהת למניעת שפיכות ולסדר במטבח.",
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
