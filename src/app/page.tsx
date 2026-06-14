import Hero from "@/components/Hero";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import BundleSection from "@/components/BundleSection";
import StickyPageCTA from "@/components/StickyPageCTA";

export default function Home() {
  return (
    <main id="main" className="flex flex-col bg-ink">
      <StickyPageCTA />
      <Hero />
      <BeforeAfterSection />
      <BundleSection />
    </main>
  );
}
