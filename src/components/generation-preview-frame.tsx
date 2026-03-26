"use client";

import { buildPreviewDocument } from "@/lib/preview/build-preview-document";

export function GenerationPreviewFrame({
  markup,
}: {
  markup: string | null;
}) {
  if (!markup) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm leading-6 text-stone-400">
        Generated preview appears here after a successful run.
      </div>
    );
  }

  return (
    <iframe
      title="Generated component preview"
      sandbox=""
      srcDoc={buildPreviewDocument(markup)}
      className="min-h-[360px] w-full rounded-[1.5rem] border border-white/10 bg-white"
    />
  );
}
