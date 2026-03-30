"use client";

import { Columns2, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { GenerationCodePanel } from "@/components/generation-code-panel";
import { GenerationPreviewFrame } from "@/components/generation-preview-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type CoreComponentType } from "@/lib/catalog/component-types";
import { cn } from "@/lib/utils";

type ResultView = "preview" | "code";

type GenerationResultViewerProps = {
  code: string | null;
  markup: string | null;
  isLoading?: boolean;
  componentType?: CoreComponentType;
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
  isLoading = false,
  componentType,
}: GenerationResultViewerProps) {
  return (
    <GenerationResultViewerContent
      key={`${code ?? ""}::${markup ?? ""}::${componentType ?? ""}::${isLoading ? "loading" : "ready"}`}
      code={code}
      markup={markup}
      isLoading={isLoading}
      componentType={componentType}
    />
  );
}

function GenerationResultViewerContent({
  code,
  markup,
  isLoading = false,
  componentType,
}: GenerationResultViewerProps) {
  const [activeView, setActiveView] = useState<ResultView>("preview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false);
  const isAnyDialogOpen = isDialogOpen || isSplitDialogOpen;

  useEffect(() => {
    if (!isAnyDialogOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDialogs();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnyDialogOpen]);

  const isPreviewActive = activeView === "preview";
  const inlineDescription = isPreviewActive
    ? "Rendered output inside the isolated preview runtime."
    : "Review the exact code returned for this component run.";
  const enlargeLabel = isPreviewActive
    ? "Open large preview"
    : "Open large code";
  const dialogTitle = isPreviewActive ? "Large preview" : "Large code";
  const selectedComponentType = componentType ?? "Button";

  function closeDialogs() {
    setIsDialogOpen(false);
    setIsSplitDialogOpen(false);
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden shadow-none">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                Generated result
              </h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                The next preview and code snapshot are being prepared now.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-primary/15 bg-accent px-3 py-1 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              In progress
            </div>
          </div>
        </div>

        <div role="status" aria-live="polite" className="p-5 sm:p-6">
          <div
            className="rounded-[var(--radius-card)] border border-border bg-card p-4"
            aria-hidden="true"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="h-3 w-24 animate-pulse rounded-full bg-foreground/8" />
              <div className="h-3 w-16 animate-pulse rounded-full bg-primary/15" />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {`${selectedComponentType} silhouette`}
            </p>
            <div className="mt-3 min-h-[220px] rounded-[var(--radius-control)] border border-dashed border-border bg-muted/50 p-4">
              {renderLoadingPreviewSkeleton(selectedComponentType)}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  function renderPanel(view: ResultView, size: "inline" | "dialog") {
    return view === "preview" ? (
      <GenerationPreviewFrame markup={markup} size={size} />
    ) : (
      <GenerationCodePanel code={code} size={size} />
    );
  }

  function renderActivePanel(size: "inline" | "dialog") {
    return renderPanel(activeView, size);
  }

  function openLargeDialog() {
    setIsSplitDialogOpen(false);
    setIsDialogOpen(true);
  }

  function openSplitDialog() {
    setIsDialogOpen(false);
    setIsSplitDialogOpen(true);
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

            <div className="flex items-center gap-1">
              <div
                role="group"
                aria-label="Generated result view"
                className="inline-flex rounded-[var(--radius-control)] border border-border bg-muted/60 p-px"
              >
                {VIEW_OPTIONS.map((view) => {
                  const isActive = activeView === view.id;

                  return (
                    <button
                      key={view.id}
                      type="button"
                      aria-pressed={isActive}
                      className={cn(
                        "rounded-[var(--radius-compact)] px-2 py-0.5 text-sm font-medium transition-[background-color,color,box-shadow]",
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
                className="h-7 px-2 text-xs"
                aria-label="Open split view"
                onClick={openSplitDialog}
              >
                <Columns2 className="size-3" />
                See both
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="size-7 p-0"
                aria-label={enlargeLabel}
                onClick={openLargeDialog}
              >
                <Maximize2 className="size-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">{renderActivePanel("inline")}</div>
      </Card>

      {isDialogOpen ? (
        <div
          className="fixed inset-0 z-50 bg-slate-950/45 p-4 sm:p-6"
          onClick={closeDialogs}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={dialogTitle}
              className="w-full max-w-[1120px] overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
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
                  onClick={closeDialogs}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="p-5 sm:p-6">{renderActivePanel("dialog")}</div>
            </div>
          </div>
        </div>
      ) : null}

      {isSplitDialogOpen ? (
        <div
          className="fixed inset-0 z-50 bg-slate-950/45 p-4 sm:p-6"
          onClick={closeDialogs}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Split view"
              className="w-full max-w-[1280px] overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                    Split view
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Compare the generated preview and code side by side.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="size-9 p-0"
                  aria-label="Close split view"
                  onClick={closeDialogs}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="grid gap-4 p-5 sm:p-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
                <div className="min-w-0 space-y-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                      Preview
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Rendered output inside the isolated preview runtime.
                    </p>
                  </div>
                  {renderPanel("preview", "dialog")}
                </div>

                <div className="min-w-0 space-y-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                      Code
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Review the exact code returned for this component run.
                    </p>
                  </div>
                  {renderPanel("code", "dialog")}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function renderLoadingPreviewSkeleton(componentType: CoreComponentType) {
  switch (componentType) {
    case "Button":
      return (
        <div className="flex min-h-[188px] flex-col items-center justify-center gap-4">
          <div className="h-11 w-36 animate-pulse rounded-full bg-primary/20" />
          <div className="h-10 w-28 animate-pulse rounded-full bg-foreground/10" />
        </div>
      );
    case "Input":
      return (
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded-full bg-primary/15" />
          <div className="flex h-12 items-center justify-between rounded-[var(--radius-control)] border border-input bg-background px-4">
            <div className="h-3 w-32 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-4 w-4 animate-pulse rounded-full bg-foreground/10" />
          </div>
        </div>
      );
    case "Textarea":
      return (
        <div className="space-y-4">
          <div className="h-3 w-28 animate-pulse rounded-full bg-primary/15" />
          <div className="space-y-3 rounded-[var(--radius-card)] border border-input bg-background p-4">
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-3 w-full animate-pulse rounded-full bg-foreground/10" />
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-16 rounded-[var(--radius-control)] bg-muted/60" />
          </div>
        </div>
      );
    case "Select":
      return (
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded-full bg-primary/15" />
          <div className="flex h-12 items-center justify-between rounded-[var(--radius-control)] border border-input bg-background px-4">
            <div className="h-3 w-28 animate-pulse rounded-full bg-foreground/10" />
            <div className="space-y-1">
              <div className="h-1.5 w-4 rounded-full bg-foreground/10" />
              <div className="h-1.5 w-3 rounded-full bg-foreground/10" />
            </div>
          </div>
          <div className="space-y-2 rounded-[var(--radius-control)] border border-border bg-card p-3">
            <div className="h-3 w-full animate-pulse rounded-full bg-foreground/8" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-foreground/8" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-foreground/8" />
          </div>
        </div>
      );
    case "Checkbox":
      return (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-[var(--radius-control)] bg-background px-3 py-3"
            >
              <div className="size-4 animate-pulse rounded-[5px] border border-input bg-muted/60" />
              <div className="h-3 flex-1 animate-pulse rounded-full bg-foreground/10" />
            </div>
          ))}
        </div>
      );
    case "Radio":
      return (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-[var(--radius-control)] bg-background px-3 py-3"
            >
              <div className="size-4 animate-pulse rounded-full border border-input bg-muted/60" />
              <div className="h-3 flex-1 animate-pulse rounded-full bg-foreground/10" />
            </div>
          ))}
        </div>
      );
    case "Switch":
      return (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-[var(--radius-control)] bg-background px-3 py-3"
            >
              <div className="space-y-2">
                <div className="h-3 w-28 animate-pulse rounded-full bg-foreground/10" />
                <div className="h-3 w-16 animate-pulse rounded-full bg-foreground/8" />
              </div>
              <div className="flex h-6 w-11 items-center rounded-full bg-primary/15 px-1">
                <div
                  className={cn(
                    "size-4 animate-pulse rounded-full bg-card",
                    index % 2 === 0 ? "ml-auto" : "",
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      );
    case "Card":
      return (
        <div className="rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="h-4 w-32 animate-pulse rounded-full bg-primary/15" />
          <div className="mt-4 space-y-3">
            <div className="h-3 w-full animate-pulse rounded-full bg-foreground/10" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-16 rounded-[var(--radius-control)] bg-muted/60" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-9 w-24 animate-pulse rounded-[var(--radius-compact)] bg-foreground/10" />
            <div className="h-9 w-20 animate-pulse rounded-[var(--radius-compact)] bg-primary/20" />
          </div>
        </div>
      );
    case "Modal":
      return (
        <div className="flex min-h-[188px] items-center justify-center rounded-[var(--radius-card)] bg-slate-950/5 p-3">
          <div className="w-full max-w-[220px] rounded-[var(--radius-card)] border border-border bg-card p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="h-4 w-28 animate-pulse rounded-full bg-primary/15" />
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-foreground/10" />
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-foreground/10" />
              <div className="h-12 rounded-[var(--radius-control)] bg-muted/60" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <div className="h-9 w-16 animate-pulse rounded-[var(--radius-compact)] bg-foreground/10" />
              <div className="h-9 w-20 animate-pulse rounded-[var(--radius-compact)] bg-primary/20" />
            </div>
          </div>
        </div>
      );
    case "Tabs":
      return (
        <div className="space-y-4">
          <div className="flex gap-2 rounded-[var(--radius-control)] bg-background p-1">
            <div className="h-8 w-20 animate-pulse rounded-[var(--radius-compact)] bg-card shadow-[0_1px_2px_rgba(15,23,42,0.06)]" />
            <div className="h-8 w-16 animate-pulse rounded-[var(--radius-compact)] bg-foreground/8" />
            <div className="h-8 w-[4.5rem] animate-pulse rounded-[var(--radius-compact)] bg-foreground/8" />
          </div>
          <div className="space-y-3 rounded-[var(--radius-card)] border border-border bg-card p-4">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-primary/15" />
            <div className="h-3 w-full animate-pulse rounded-full bg-foreground/10" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-20 rounded-[var(--radius-control)] bg-muted/60" />
          </div>
        </div>
      );
    case "Accordion":
      return (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-[var(--radius-control)] border border-border bg-background px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="h-3 flex-1 animate-pulse rounded-full bg-foreground/10" />
                <div className="h-3 w-3 animate-pulse rounded-full bg-primary/20" />
              </div>
              {index === 0 ? (
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded-full bg-foreground/8" />
                  <div className="h-3 w-4/5 animate-pulse rounded-full bg-foreground/8" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      );
    case "Navbar":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-[var(--radius-card)] border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="size-8 animate-pulse rounded-full bg-primary/20" />
              <div className="h-3 w-20 animate-pulse rounded-full bg-foreground/10" />
            </div>
            <div className="hidden gap-2 sm:flex">
              <div className="h-3 w-12 animate-pulse rounded-full bg-foreground/8" />
              <div className="h-3 w-14 animate-pulse rounded-full bg-foreground/8" />
              <div className="h-3 w-10 animate-pulse rounded-full bg-foreground/8" />
            </div>
            <div className="h-9 w-20 animate-pulse rounded-full bg-primary/20" />
          </div>
          <div className="h-28 rounded-[var(--radius-card)] bg-muted/60" />
        </div>
      );
  }
}
