import { AppSidebar } from "@/components/app-sidebar";

export default function GenerationHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] gap-3 xl:grid-cols-[272px_minmax(0,1fr)]">
      <AppSidebar />
      <div className="rounded-[16px] border border-border bg-white p-5 sm:p-6 lg:p-7">
        {children}
      </div>
    </div>
  );
}
