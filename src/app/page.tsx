import Hero from "@/components/Hero";
import ProductIntroduction from "@/components/ProductIntroduction";
import ProductBreakdownDiagram from "@/components/ProductBreakdownDiagram";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { LeadCaptureProvider } from "@/components/LeadCapture";

export default function Home() {
  return (
    <LeadCaptureProvider>
      <main id="main" className="flex min-h-[100svh] flex-col">
        <Hero />
        <ProductIntroduction />
        <ProductBreakdownDiagram />
        <FAQ />
        <FinalCTA />
      </main>
      <StickyMobileCTA />
    </LeadCaptureProvider>
  );
}
