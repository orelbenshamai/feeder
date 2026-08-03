import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import SectionVisibilityTracker from "@/components/SectionVisibilityTracker";
import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"));

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      {/* After sections/footer so IntersectionObserver can find their IDs */}
      <SectionVisibilityTracker />
    </>
  );
}
