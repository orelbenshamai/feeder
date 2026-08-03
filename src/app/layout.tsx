import { media } from "@/lib/media";
import type { Metadata } from "next";
import { Heebo, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import DeferredGTM from "@/components/DeferredGTM";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  display: "swap",
  // Variable font — one family file covers 100–900 (far less @font-face CSS).
  weight: "variable",
  // LCP is the hero poster image, not text — don't put the font on the
  // critical request chain via <link rel="preload">. display:swap keeps FCP.
  preload: false,
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["800"],
  preload: false, // brand wordmark only — not LCP
});

export const metadata: Metadata = {
  title: "מסודר — רצפה יבשה, האכלה נקייה",
  description:
    "עמדת ההאכלה שמונעת רטיבות ופיזור מזון. משלוחים לכל הארץ ואחריות מלאה.",
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
      <DeferredGTM gtmId="GTM-MC36BKQK" />
      <head>
        {/* Lock iOS viewport height once (px) — never update on URL bar show/hide. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var root=document.documentElement;var locked=Infinity;function readH(){var vv=window.visualViewport;var ih=window.innerHeight||0;var vh=vv&&vv.height?vv.height:ih;return Math.min(ih,vh);}function snap(){var h=readH();if(!(h>0))return;locked=Math.min(locked,h);root.style.setProperty('--ios-vh',locked+'px');}function init(){locked=Infinity;snap();setTimeout(snap,120);setTimeout(snap,380);}init();window.addEventListener('orientationchange',function(){setTimeout(init,350);});})();",
          }}
        />
      </head>
      <body className="flex min-h-screen-stable flex-col bg-cream text-ink selection:bg-ink selection:text-cream">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
