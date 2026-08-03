import { media } from "@/lib/media";
import type { Metadata } from "next";
import { Heebo, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import DeferredGTM from "@/components/DeferredGTM";

const heebo = Heebo({
  variable: "--font-heebo",
  // Hebrew UI only — MESUDAR wordmark uses Nunito; dropping latin shrinks the woff2.
  subsets: ["hebrew"],
  // optional = short block, no late swap — keeps the font off the LCP critical path.
  // (swap still discovers/fetches the file from inlined @font-face during HTML parse.)
  display: "optional",
  weight: "variable",
  preload: false,
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "optional",
  weight: ["800"],
  preload: false,
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
        {/*
          Lock iOS viewport height once (px). Deferred to after first paint so
          readH() + setProperty don't force a synchronous reflow on the critical path.
          CSS already falls back to 100svh until this runs.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var root=document.documentElement;var locked=Infinity;function readH(){var vv=window.visualViewport;var ih=window.innerHeight||0;var vh=vv&&vv.height?vv.height:ih;return Math.min(ih,vh);}function snap(){var h=readH();if(!(h>0))return;locked=Math.min(locked,h);root.style.setProperty("--ios-vh",locked+"px");window.dispatchEvent(new Event("mesudar:ios-vh"));}function init(){locked=Infinity;requestAnimationFrame(function(){requestAnimationFrame(snap);});}if(document.readyState==="complete"){init();}else{window.addEventListener("load",init,{once:true});}window.addEventListener("orientationchange",function(){setTimeout(init,350);});})();`,
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
