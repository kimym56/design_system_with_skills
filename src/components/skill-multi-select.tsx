"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SkillOption = {
  id: string;
  name: string;
  description: string | null;
  githubStars: number;
};

export function SkillMultiSelect({
  options,
  selectedIds,
  onToggle,
}: {
  options: SkillOption[];
  selectedIds: string[];
  onToggle: (skillId: string) => void;
}) {
  if (options.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-muted/50 p-5 text-sm leading-6 text-muted-foreground">
        No approved skills are available yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {options.map((skill) => {
        const active = selectedIds.includes(skill.id);

        return (
          <label
            key={skill.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-[16px] border px-4 py-4 transition-[background-color,border-color,box-shadow]",
              active
                ? "border-primary/20 bg-accent/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                : "border-border/80 bg-card hover:border-border hover:bg-secondary/70",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] border",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background text-transparent",
              )}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(skill.id)}
                className="sr-only"
              />
              <Check className="size-3" />
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium tracking-[-0.01em] text-foreground">
                  {skill.name}
                </span>
                <Badge variant={active ? "default" : "secondary"}>
                  {skill.githubStars} stars
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {skill.description ?? "No description available."}
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
