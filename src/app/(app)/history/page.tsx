import { HistoryList } from "@/components/history-list";

export default function HistoryPage() {
  return (
    <main className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-300">
          Saved Runs
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Generation history
        </h1>
        <p className="max-w-2xl text-base leading-7 text-stone-300">
          Review saved generations and reopen prior code or preview results.
        </p>
      </header>

      <HistoryList />
    </main>
  );
}
