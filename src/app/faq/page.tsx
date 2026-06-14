import type { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "שאלות נפוצות — מסודר",
  description: "תשובות לשאלות הנפוצות ביותר על מוצרי מסודר: משלוחים, הזמנות, אחריות וניקיון.",
};

export default function FAQPage() {
  return (
    <main id="main">
      <FAQ />
    </main>
  );
}
