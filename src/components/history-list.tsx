"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HistoryItem = {
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

export function HistoryList() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
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
          setError(payload.error ?? "Unable to load history.");
          return;
        }

        setItems(payload.generations);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load history.",
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
      <Card className="border-destructive/15 bg-destructive/5 shadow-none">
        <CardContent className="p-5 text-sm leading-6 text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (items === null) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {[0, 1].map((placeholder) => (
          <Card key={placeholder} className="shadow-none">
            <CardContent className="space-y-3 p-5">
              <div className="h-3 w-24 rounded-full bg-muted" />
              <div className="h-6 w-40 rounded-full bg-muted" />
              <div className="h-3 w-full rounded-full bg-muted" />
              <div className="h-3 w-2/3 rounded-full bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed bg-white shadow-none">
        <CardContent className="space-y-2 p-6">
          <p className="text-xl font-semibold tracking-[-0.02em] text-foreground">
            No runs yet.
          </p>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Run a generation in the workspace to save the approved inputs,
            rendered preview, and source for later review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-white">
      {items.map((item) => {
        const skillNames = item.selectedSkills.map(({ skill }) => skill.name);

        return (
          <Link
            key={item.id}
            href={`/history/${item.id}`}
            className={cn(
              "group block px-4 py-3.5 transition-colors hover:bg-secondary/60",
              item !== items[0] ? "border-t border-border" : "",
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
              )}
            >
              <div className="space-y-2">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                  <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                    {item.componentType}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="size-4" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm leading-5 text-muted-foreground">
                  {skillNames.join(" • ")}
                </p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
