import Hero from "@/components/Hero";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import ProductBreakdownDiagram from "@/components/ProductBreakdownDiagram";
import MatLandingSection from "@/components/MatLandingSection";
import BundleSection from "@/components/BundleSection";
import StickyPageCTA from "@/components/StickyPageCTA";

function SectionDivider() {
  return (
    <div className="bg-ink flex items-center justify-center px-8 py-1">
      <div className="flex w-full max-w-xl items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cream/20" />
        <div className="h-2 w-2 rounded-full bg-clay/60" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cream/20" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="main" className="flex flex-col bg-ink">
      <StickyPageCTA />
      <Hero />
      <BeforeAfterSection />
      <ProductBreakdownDiagram />
      <SectionDivider />
      <BundleSection />
    </main>
  );
}
