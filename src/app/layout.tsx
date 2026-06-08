import type { Metadata, Viewport } from "next";
import { Heebo, Nunito } from "next/font/google";
import "./globals.css";
import { FacebookPixel } from "@/components/FacebookPixel";
import SiteHeader from "@/components/SiteHeader";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "overlays-content",
};

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
      className={`${heebo.variable} ${nunito.variable} h-full antialiased font-sans`}
    >
      <head>
        {/* Lock iOS viewport to the smallest height (URL bar visible) — never grow on scroll. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function r(){var h=window.innerHeight;if(window.visualViewport)h=Math.min(h,window.visualViewport.height);return h;}function a(h){var c=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ios-vh'));if(!c||h<c)document.documentElement.style.setProperty('--ios-vh',h+'px');}a(r());if(window.scrollY===0)requestAnimationFrame(function(){a(r());});})();`,
          }}
        />
        <FacebookPixel />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink selection:bg-ink selection:text-cream">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
