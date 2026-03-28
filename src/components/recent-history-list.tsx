"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

type RecentHistoryItem = {
  id: string;
  componentType: string;
  createdAt: string;
  selectedSkills: Array<{
    skill: {
      id: string;
      name: string;
    };
  }>;
};

function formatRecentRunTime(createdAt: string) {
  return new Date(createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RecentHistoryList() {
  const [items, setItems] = useState<RecentHistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const response = await fetch("/api/history");
        const payload = await response.json();

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(payload.error ?? "Unable to load recent runs.");
          return;
        }

        setItems(payload.generations.slice(0, 5));
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load recent runs.",
          );
        }
      }
    }

    void loadHistory();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-[14px] border border-destructive/15 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (items === null) {
    return (
      <div
        role="status"
        aria-label="Loading recent runs"
        className="space-y-2"
      >
        {[0, 1, 2].map((placeholder) => (
          <div
            key={placeholder}
            className="rounded-[14px] border border-border bg-white px-3 py-3"
          >
            <div className="h-3 w-20 rounded-full bg-muted" />
            <div className="mt-2 h-4 w-24 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-border bg-secondary/40 px-3 py-3">
        <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
          No recent runs yet
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Saved generations will appear here after your first successful run.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const skillNames = item.selectedSkills.map(({ skill }) => skill.name);
        const skillSummary =
          skillNames.length > 0 ? skillNames.slice(0, 2).join(" • ") : null;

        return (
          <Link
            key={item.id}
            href={`/history/${item.id}`}
            className={cn(
              "group block rounded-[14px] border bg-white px-3 py-3 transition-colors hover:border-primary/20 hover:bg-secondary/50",
              index === 0 ? "border-primary/15" : "border-border",
            )}
          >
            <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
              {item.componentType}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="size-3.5 shrink-0" />
              <span>{formatRecentRunTime(item.createdAt)}</span>
            </div>
            {skillSummary ? (
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {skillSummary}
              </p>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
