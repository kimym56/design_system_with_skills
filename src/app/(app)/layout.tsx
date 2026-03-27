import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] gap-4 xl:grid-cols-[252px_minmax(0,1fr)]">
        <AppSidebar />
        <div className="rounded-[24px] border border-border/70 bg-white/88 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur sm:p-7 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
