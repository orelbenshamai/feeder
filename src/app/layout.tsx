import { media } from "@/lib/media";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import DeferredGTM from "@/components/DeferredGTM";

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
    <html lang="he" dir="rtl" suppressHydrationWarning className="antialiased font-sans">
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
        {/*
          Web fonts after load/idle — avoids next/font inlined @font-face (critical
          chain + useless same-origin preconnect) competing with LCP.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function inject(){if(document.querySelector('link[data-mesudar-fonts]'))return;var l=document.createElement("link");l.rel="stylesheet";l.href="/fonts/fonts.css";l.setAttribute("data-mesudar-fonts","");document.head.appendChild(l);}function schedule(){if("requestIdleCallback" in window){requestIdleCallback(inject,{timeout:2500});}else{setTimeout(inject,1);}}if(document.readyState==="complete"){schedule();}else{window.addEventListener("load",schedule,{once:true});}})();`,
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
