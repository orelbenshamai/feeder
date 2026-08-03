import Hero from "@/components/Hero";
import dynamic from "next/dynamic";

const StickyPageCTA = dynamic(() => import("@/components/StickyPageCTA"));
const BeforeAfterSection = dynamic(() => import("@/components/BeforeAfterSection"));
const BundleSection = dynamic(() => import("@/components/BundleSection"));

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
