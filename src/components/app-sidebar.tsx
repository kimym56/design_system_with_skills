"use client";

import { AppSidebarContent } from "@/components/app-sidebar-content";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "h-full bg-white text-foreground",
        className,
      )}
    >
      <div className="h-full overflow-y-auto px-4 py-4 sm:px-5">
        <AppSidebarContent />
      </div>
    </aside>
  );
}
