"use client";

import { buildPreviewDocument } from "@/lib/preview/build-preview-document";

export function GenerationPreviewFrame({
  markup,
}: {
  markup: string | null;
}) {
  if (!markup) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-[12px] border border-dashed border-border bg-muted/30 p-6 text-sm leading-6 text-muted-foreground">
        Generated preview appears here after a successful run.
      </div>
    );
  }

  return (
    <iframe
      title="Generated component preview"
      sandbox=""
      srcDoc={buildPreviewDocument(markup)}
      className="min-h-[360px] w-full rounded-[12px] border border-border bg-white"
    />
  );
}
