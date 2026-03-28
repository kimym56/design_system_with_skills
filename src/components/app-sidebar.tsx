"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { RecentHistoryList } from "@/components/recent-history-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname() ?? "";
  const isWorkspaceRoute = pathname === "/workspace";
  const isHistoryRoute = pathname.startsWith("/history");

  return (
    <aside className="rounded-[16px] border border-border bg-white px-3 py-3 text-foreground xl:sticky xl:top-4 xl:min-h-[calc(100vh-2rem)]">
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Design System AI
          </p>
          <h2 className="text-sm font-medium tracking-[-0.01em] text-foreground">
            Generation workspace
          </h2>
          <p className="text-sm leading-5 text-muted-foreground">
            Start a run or revisit saved output without leaving the same working context.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild size="sm" className="w-full justify-between">
            <Link
              href="/workspace"
              aria-current={isWorkspaceRoute ? "page" : undefined}
            >
              New run
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Link
            href="/history"
            aria-current={isHistoryRoute ? "page" : undefined}
            className={cn(
              "group flex items-center justify-between rounded-[12px] border px-3 py-2.5 text-sm font-medium tracking-[-0.01em] text-foreground transition-colors",
              isHistoryRoute
                ? "border-primary/15 bg-accent"
                : "border-border bg-secondary/30 hover:bg-secondary",
            )}
          >
            <span>View all history</span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Separator />

        <section className="space-y-3" aria-labelledby="recent-runs-heading">
          <div className="space-y-1">
            <h3
              id="recent-runs-heading"
              className="text-sm font-medium tracking-[-0.01em] text-foreground"
            >
              Recent runs
            </h3>
            <p className="text-xs leading-5 text-muted-foreground">
              Open a saved generation to inspect the approved inputs and output.
            </p>
          </div>
          <RecentHistoryList />
        </section>
      </div>
    </aside>
  );
}
