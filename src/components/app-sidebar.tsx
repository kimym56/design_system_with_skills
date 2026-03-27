"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Clock3, Layers3 } from "lucide-react";

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
    <aside className="rounded-[16px] border border-border bg-white px-3 py-3 text-foreground xl:sticky xl:top-4 xl:min-h-[calc(100vh-2rem)]">
      <div className="flex h-full flex-col gap-5">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Design System AI
            </p>
            <h2 className="text-sm font-medium tracking-[-0.01em] text-foreground">
              Approved component pipeline
            </h2>
          </div>
          <Button asChild size="sm" className="w-full justify-between">
            <Link href="/workspace">
              New run
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Separator />

        <nav className="space-y-0.5">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "group flex items-center gap-2.5 rounded-[10px] border px-3 py-2 text-sm transition-[background-color,border-color]",
                pathname === item.href
                  ? "border-primary/15 bg-accent text-foreground"
                  : "border-transparent bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="min-w-0 flex-1 truncate font-medium tracking-[-0.01em]">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
