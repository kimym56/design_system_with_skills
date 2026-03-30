import { HistoryList } from "@/components/history-list";
import { requireUserSession } from "@/lib/auth/guards";

export default async function HistoryPage() {
  await requireUserSession("/history");

  return (
    <main className="space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          Saved runs
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Open a previous generation to inspect approved inputs, preview
          output, and source.
        </p>
      </header>

      <HistoryList />
    </main>
  );
}
