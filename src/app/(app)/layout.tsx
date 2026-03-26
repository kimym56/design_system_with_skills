import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_32%),linear-gradient(180deg,_#120f0a_0%,_#09090b_100%)] px-4 py-4 text-stone-100 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AppSidebar />
        <div className="rounded-[2rem] border border-white/10 bg-stone-900/70 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
