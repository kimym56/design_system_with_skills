import { GenerationHistoryShell } from "@/components/generation-history-shell";

export default function GenerationHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GenerationHistoryShell>{children}</GenerationHistoryShell>
  );
}
