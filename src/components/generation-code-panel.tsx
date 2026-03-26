"use client";

export function GenerationCodePanel({
  code,
}: {
  code: string | null;
}) {
  if (!code) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-stone-950/70 p-6 text-sm leading-6 text-stone-400">
        Generated component code will be shown here.
      </div>
    );
  }

  return (
    <pre className="min-h-[320px] overflow-x-auto rounded-[1.5rem] border border-white/10 bg-stone-950 px-5 py-5 text-sm leading-6 text-stone-100">
      <code>{code}</code>
    </pre>
  );
}
