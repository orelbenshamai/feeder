import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "אודות מסודר",
  description: "הסיפור מאחורי מסודר — עמדת ההאכלה שתוכננה לנוחות ועוצבה לבית.",
};

export default function AboutPage() {
  return (
    <main id="main">
      <AboutSection />
    </main>
  );
}
