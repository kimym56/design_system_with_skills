import { Badge } from "@/components/ui/badge";
import { HistoryList } from "@/components/history-list";

export default function HistoryPage() {
  return (
    <main className="space-y-8">
      <header className="space-y-4">
        <Badge variant="outline">History</Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            Saved runs
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Open a previous generation to inspect approved inputs, preview
            output, and source.
          </p>
        </div>
      </header>

      <HistoryList />
    </main>
  );
}
