"use client";

import { useEffect, useRef, useState } from "react";
import { Copy } from "lucide-react";

import { highlightTsx } from "@/lib/code-viewer/highlight-tsx";
import { cn } from "@/lib/utils";

type GeneratedCodeViewerProps = {
  code: string | null;
  size?: "inline" | "dialog";
};

export function GeneratedCodeViewer({
  code,
  size = "inline",
}: GeneratedCodeViewerProps) {
  const viewerHeightClass =
    size === "dialog" ? "min-h-[72vh] max-h-[72vh]" : "min-h-[420px] max-h-[420px]";
  const lines = code ? code.split("\n") : [];
  const highlightedLines = code ? highlightTsx(code) : [];
  const [isCopied, setIsCopied] = useState(false);
  const resetCopiedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetCopiedTimeoutRef.current !== null) {
        window.clearTimeout(resetCopiedTimeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (!code || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      if (resetCopiedTimeoutRef.current !== null) {
        window.clearTimeout(resetCopiedTimeoutRef.current);
      }

      resetCopiedTimeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
        resetCopiedTimeoutRef.current = null;
      }, 1500);
    } catch {
      // Keep the viewer usable even if clipboard access fails.
    }
  }

  const copyLabel = isCopied ? "Copied" : "Copy";
  const copyActionLabel = `${copyLabel} generated code`;

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-[12px] border border-slate-800 bg-code-surface text-code-foreground",
        viewerHeightClass,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/90 px-4 py-3">
        <div className="min-w-0">
          <div className="inline-flex max-w-full items-center rounded-t-[10px] border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs font-medium text-slate-100">
            <span className="truncate">generated-component.tsx</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[11px] font-semibold tracking-[0.16em] text-blue-200">
            TSX
          </span>

          <button
            type="button"
            aria-label={copyActionLabel}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!code}
            onClick={() => {
              void handleCopy();
            }}
          >
            <Copy className="size-3.5" />
            <span>{copyLabel}</span>
          </button>
        </div>
      </div>

      <div className="border-b border-slate-800/80 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
        Read-only generated artifact
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[48px_minmax(0,1fr)]">
        <div
          aria-hidden="true"
          className="border-r border-slate-800/80 bg-slate-950/70 py-4 text-right font-mono text-xs leading-6 text-slate-500"
        >
          {code
            ? lines.map((_, index) => (
                <div key={index} className="px-3">
                  {index + 1}
                </div>
              ))
            : null}
        </div>

        {code ? (
          <pre className="min-h-0 overflow-auto px-5 py-4 font-mono text-sm leading-6 text-code-foreground">
            <code>
              {highlightedLines.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.map((token, tokenIndex) => (
                    <span
                      key={`${lineIndex}-${tokenIndex}`}
                      data-token-type={token.type}
                      className={cn(
                        token.type === "keyword" && "text-violet-300",
                        token.type === "tag" && "text-amber-300",
                        token.type === "attribute" && "text-emerald-300",
                        token.type === "string" && "text-rose-300",
                      )}
                    >
                      {token.value}
                    </span>
                  ))}
                </span>
              ))}
            </code>
          </pre>
        ) : (
          <div className="flex min-h-0 items-center px-5 py-4 font-mono text-sm leading-6 text-slate-400">
            Generated component code appears after a successful run.
          </div>
        )}
      </div>
    </section>
  );
}
