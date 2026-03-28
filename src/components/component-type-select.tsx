"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import {
  COMPONENT_TYPE_SUMMARIES,
  CORE_COMPONENT_TYPES,
  type CoreComponentType,
} from "@/lib/catalog/component-types";
import { cn } from "@/lib/utils";

export function ComponentTypeSelect({
  value,
  onSelect,
  labelId,
}: {
  value: CoreComponentType;
  onSelect: (value: CoreComponentType) => void;
  labelId?: string;
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

  function handleSelect(nextValue: CoreComponentType) {
    onSelect(nextValue);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={popupId}
        aria-labelledby={labelId ? `${labelId} ${triggerTextId}` : triggerTextId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-9 w-full items-center justify-between gap-3 rounded-[10px] border border-input bg-background px-3 text-sm text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span id={triggerTextId} className="min-w-0 truncate text-left">
          {value}
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
            {CORE_COMPONENT_TYPES.map((componentType) => {
              const active = componentType === value;

              return (
                <button
                  key={componentType}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleSelect(componentType)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[10px] px-3 py-3 text-left transition-[background-color,border-color]",
                    active ? "bg-accent/50" : "bg-white hover:bg-secondary/60",
                  )}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="block truncate text-sm font-medium tracking-[-0.01em] text-foreground">
                      {componentType}
                    </span>
                    <p className="text-sm leading-5 text-muted-foreground">
                      {COMPONENT_TYPE_SUMMARIES[componentType]}
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
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
