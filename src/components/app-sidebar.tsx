"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Clock3, Layers3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navigation = [
  {
    href: "/workspace",
    label: "Workspace",
    description: "Generate from approved skills",
    icon: Layers3,
  },
  {
    href: "/history",
    label: "History",
    description: "Review saved component runs",
    icon: Clock3,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col justify-between rounded-[24px] border border-border/70 bg-white/88 px-4 py-4 text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur xl:sticky xl:top-5 xl:min-h-[calc(100vh-2.5rem)]">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline">Open access</Badge>
            <span className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground">
              Guest
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Design System AI
            </p>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              Approved component pipeline
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Generate, inspect, and store runs from the curated catalog.
            </p>
          </div>
          <Button asChild size="sm" className="w-full justify-between">
            <Link href="/workspace">
              New run
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Separator />

        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "group flex items-start gap-3 rounded-[16px] border px-3.5 py-3 transition-[background-color,border-color,box-shadow]",
                pathname === item.href
                  ? "border-primary/20 bg-accent/80 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                  : "border-transparent bg-transparent hover:border-border hover:bg-secondary/70",
              )}
            >
              <item.icon
                className={cn(
                  "mt-0.5 size-4 shrink-0 transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="space-y-1.5">
                <span className="block text-sm font-medium tracking-[-0.01em]">
                  {item.label}
                </span>
                <span className="block text-sm leading-5 text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <Separator />
        <div className="rounded-[16px] border border-border/70 bg-secondary/70 px-4 py-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Safe runtime. Approved inputs. Saved runs.
          </p>
        </div>
      </div>
    </aside>
  );
}
