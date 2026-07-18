import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SectionVisibilityTracker from "@/components/SectionVisibilityTracker";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {/* Spacer so fixed header doesn't overlap page content */}
      <div className="h-11 shrink-0 sm:h-12 md:h-14" aria-hidden />
      <CartDrawer />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      {/* After sections/footer so IntersectionObserver can find their IDs */}
      <SectionVisibilityTracker />
    </>
  );
}
