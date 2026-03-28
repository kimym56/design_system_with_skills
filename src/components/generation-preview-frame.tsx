"use client";

import { buildPreviewDocument } from "@/lib/preview/build-preview-document";
import { cn } from "@/lib/utils";

export function GenerationPreviewFrame({
  markup,
  size = "inline",
}: {
  markup: string | null;
  size?: "inline" | "dialog";
}) {
  const frameHeightClass =
    size === "dialog" ? "min-h-[72vh]" : "min-h-[280px] sm:min-h-[320px]";

  if (!markup) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-[12px] border border-dashed border-border bg-muted/30 p-6 text-sm leading-6 text-muted-foreground",
          frameHeightClass,
        )}
      >
        Generated preview appears here after a successful run.
      </div>
    );
  }

  return (
    <iframe
      title="Generated component preview"
      sandbox=""
      srcDoc={buildPreviewDocument(markup)}
      className={cn(
        "w-full rounded-[12px] border border-border bg-white",
        frameHeightClass,
      )}
    />
  );
}
