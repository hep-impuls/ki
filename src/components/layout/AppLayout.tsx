import TopAppBar from "./TopAppBar";
import SideNav from "./SideNav";
import MobileNav from "./MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopAppBar />

      <div className="flex max-w-[1440px] mx-auto w-full flex-grow">
        <SideNav />
        <main className="flex-grow p-lg md:p-xl w-full max-w-[var(--container-max,1280px)] mx-auto">
          {children}
        </main>
      </div>

      <MobileNav />
      <div className="h-16 md:hidden" />
    </div>
  );
}
