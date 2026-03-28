"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { formatGitHubStars } from "@/lib/catalog/format-github-stars";
import { cn } from "@/lib/utils";

type SkillOption = {
  id: string;
  name: string;
  title: string;
  description: string | null;
  githubStars: number;
};

export function SkillMultiSelect({
  options,
  selectedIds,
  onToggle,
  labelId,
  disabled = false,
}: {
  options: SkillOption[];
  selectedIds: string[];
  onToggle: (skillId: string) => void;
  labelId?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupId = useId();
  const triggerTextId = `${popupId}-value`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (options.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-border bg-muted/50 p-4 text-sm leading-5 text-muted-foreground">
        No approved skills are available yet.
      </div>
    );
  }

  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id),
  );
  const triggerLabel =
    selectedOptions.length === 0
      ? "Select skills"
      : selectedOptions.length === 1
        ? selectedOptions[0].title
        : `${selectedOptions.length} skills selected`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={popupId}
        aria-labelledby={labelId ? `${labelId} ${triggerTextId}` : triggerTextId}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-3 rounded-[10px] border border-input bg-background px-3 text-sm text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted-foreground",
          selectedOptions.length > 0 ? "border-border" : "text-muted-foreground",
        )}
      >
        <span
          id={triggerTextId}
          className={cn(
            "min-w-0 truncate text-left",
            selectedOptions.length > 0 ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {triggerLabel}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen ? (
        <div
          id={popupId}
          role="group"
          aria-labelledby={labelId}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full overflow-hidden rounded-[12px] border border-border bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
        >
          <div className="max-h-80 overflow-y-auto p-1.5">
            {options.map((skill) => {
              const active = selectedIds.includes(skill.id);

              return (
                <label
                  key={skill.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-[10px] px-3 py-3 transition-[background-color,border-color]",
                    active
                      ? "bg-accent/50"
                      : "bg-white hover:bg-secondary/60",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    disabled={disabled}
                    onChange={() => onToggle(skill.id)}
                    className="sr-only"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className="truncate text-sm font-medium tracking-[-0.01em] text-foreground">
                        {skill.title}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatGitHubStars(skill.githubStars)} stars
                      </span>
                    </div>
                    <p className="text-sm leading-5 text-muted-foreground">
                      {skill.description ?? "No description available."}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] border",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background text-transparent",
                    )}
                  >
                    <Check className="size-3" />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
