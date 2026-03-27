import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] gap-3 xl:grid-cols-[220px_minmax(0,1fr)]">
        <AppSidebar />
        <div className="rounded-[16px] border border-border bg-white p-5 sm:p-6 lg:p-7">
          {children}
        </div>
      </div>
    </div>
  );
}
