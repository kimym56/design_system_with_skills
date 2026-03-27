"use client";

export function GenerationCodePanel({
  code,
}: {
  code: string | null;
}) {
  if (!code) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[18px] border border-slate-800 bg-code-surface p-6 font-mono text-sm leading-6 text-slate-400">
        Generated component code will be shown here.
      </div>
    );
  }

  return (
    <pre className="min-h-[320px] overflow-x-auto rounded-[18px] border border-slate-800 bg-code-surface px-5 py-5 font-mono text-sm leading-6 text-code-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <code>{code}</code>
    </pre>
  );
}
