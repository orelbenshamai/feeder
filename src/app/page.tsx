import Hero from "@/components/Hero";
import ProductBreakdownDiagram from "@/components/ProductBreakdownDiagram";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { LeadCaptureProvider } from "@/components/LeadCapture";

export default function Home() {
  return (
    <LeadCaptureProvider>
      <WhatsAppFloat />
      <main id="main" className="flex min-h-[100svh] flex-col">
        <Hero />
        <ProductBreakdownDiagram />
        <FAQ />
        <FinalCTA />
      </main>
      <StickyMobileCTA />
    </LeadCaptureProvider>
  );
}
