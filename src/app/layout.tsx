import { media } from "@/lib/media";
import type { Metadata } from "next";
import { Heebo, Nunito } from "next/font/google";
import "./globals.css";
import { FacebookPixel } from "@/components/FacebookPixel";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["800"],
});

export const metadata: Metadata = {
  title: "מסודר — רצפה יבשה, האכלה נקייה",
  description:
    "עמדת ההאכלה שמונעת רטיבות ופיזור מזון. שרינו הנחת השקה של 10%, משלוחים לכל הארץ ואחריות מלאה.",
  icons: {
    icon: [{ url: media("logo_sym.png"), type: "image/png" }],
    apple: [{ url: media("logo_sym.png"), type: "image/png" }],
    shortcut: media("logo_sym.png"),
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
      suppressHydrationWarning
      className={`${heebo.variable} ${nunito.variable} antialiased font-sans`}
    >
      <head>
        {/* Lock iOS viewport height once (px) — never update on URL bar show/hide. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var r=document.documentElement;var locked=0;function snap(){locked=window.innerHeight;r.style.setProperty('--ios-vh',locked+'px');}snap();if(window.visualViewport){window.visualViewport.addEventListener('resize',function(){var h=window.visualViewport.height;if(h<locked-1){snap();}});}window.addEventListener('orientationchange',function(){locked=0;setTimeout(snap,350);});})();",
          }}
        />
        <FacebookPixel />
      </head>
      <body className="flex min-h-screen-stable flex-col bg-cream text-ink selection:bg-ink selection:text-cream">
        <CartProvider>
          <SiteHeader />
          <CartDrawer />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
