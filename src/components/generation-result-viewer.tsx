"use client";

import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

import { GenerationCodePanel } from "@/components/generation-code-panel";
import { GenerationPreviewFrame } from "@/components/generation-preview-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ResultView = "preview" | "code";

type GenerationResultViewerProps = {
  code: string | null;
  markup: string | null;
};

const VIEW_OPTIONS: Array<{
  id: ResultView;
  label: string;
}> = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Code" },
];

export function GenerationResultViewer({
  code,
  markup,
}: GenerationResultViewerProps) {
  return (
    <GenerationResultViewerContent
      key={`${code ?? ""}::${markup ?? ""}`}
      code={code}
      markup={markup}
    />
  );
}

function GenerationResultViewerContent({
  code,
  markup,
}: GenerationResultViewerProps) {
  const [activeView, setActiveView] = useState<ResultView>("preview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDialogOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDialogOpen]);

  const isPreviewActive = activeView === "preview";
  const inlineDescription = isPreviewActive
    ? "Rendered output inside the isolated preview runtime."
    : "Review the exact code returned for this component run.";
  const enlargeLabel = isPreviewActive ? "Open large preview" : "Open large code";
  const dialogTitle = isPreviewActive ? "Large preview" : "Large code";

  function renderActivePanel(size: "inline" | "dialog") {
    return isPreviewActive ? (
      <GenerationPreviewFrame markup={markup} size={size} />
    ) : (
      <GenerationCodePanel code={code} size={size} />
    );
  }

  return (
    <>
      <Card className="overflow-hidden shadow-none">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                Generated result
              </h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {inlineDescription}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                role="group"
                aria-label="Generated result view"
                className="inline-flex rounded-[12px] border border-border bg-muted/60 p-1"
              >
                {VIEW_OPTIONS.map((view) => {
                  const isActive = activeView === view.id;

                  return (
                    <button
                      key={view.id}
                      type="button"
                      aria-pressed={isActive}
                      className={cn(
                        "rounded-[8px] px-3 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow]",
                        isActive
                          ? "bg-card text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() => setActiveView(view.id)}
                    >
                      {view.label}
                    </button>
                  );
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="size-9 p-0"
                aria-label={enlargeLabel}
                onClick={() => setIsDialogOpen(true)}
              >
                <Maximize2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">{renderActivePanel("inline")}</div>
      </Card>

      {isDialogOpen ? (
        <div
          className="fixed inset-0 z-50 bg-slate-950/45 p-4 sm:p-6"
          onClick={() => setIsDialogOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={dialogTitle}
              className="w-full max-w-[1120px] overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                    {dialogTitle}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {inlineDescription}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="size-9 p-0"
                  aria-label="Close large view"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="p-5 sm:p-6">{renderActivePanel("dialog")}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
