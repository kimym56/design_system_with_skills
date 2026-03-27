"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((placeholder) => (
          <Card key={placeholder} className="shadow-none">
            <CardContent className="space-y-4 p-6">
              <div className="h-3 w-24 rounded-full bg-muted" />
              <div className="h-8 w-40 rounded-full bg-muted" />
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
      <Card className="border-dashed bg-secondary/50 shadow-none">
        <CardContent className="space-y-4 p-8">
          <Badge variant="secondary">History</Badge>
          <div className="space-y-2">
            <p className="text-xl font-semibold tracking-[-0.02em] text-foreground">
              No runs yet.
            </p>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Run a generation in the workspace to save the approved inputs,
              rendered preview, and source for later review.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => {
        const skillNames = item.selectedSkills.map(({ skill }) => skill.name);

        return (
          <Link key={item.id} href={`/history/${item.id}`} className="group block">
            <Card
              className={cn(
                "h-full border-border/80 bg-white/92 transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_22px_50px_rgba(59,91,219,0.10)]",
              )}
            >
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Badge variant="outline">Saved run</Badge>
                    <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                      {item.componentType}
                    </h2>
                  </div>
                  <ArrowUpRight className="size-4 text-primary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="size-4" />
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Selected skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillNames.map((skillName) => (
                      <Badge key={skillName} variant="outline">
                        {skillName}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
