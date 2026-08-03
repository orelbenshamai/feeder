import Hero from "@/components/Hero";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import dynamic from "next/dynamic";

const StickyPageCTA = dynamic(() => import("@/components/StickyPageCTA"));
const BundleSection = dynamic(() => import("@/components/BundleSection"));

export default function Home() {
  return (
    <main id="main" className="flex flex-col bg-ink">
      <StickyPageCTA />
      <Hero />
      {/* Keep ScrollTrigger section as a static import — dynamic() races pin math. */}
      <BeforeAfterSection />
      <BundleSection />
    </main>
  );
}
