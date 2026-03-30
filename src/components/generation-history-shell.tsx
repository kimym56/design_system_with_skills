"use client";

import { Menu } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { AccountMenu } from "@/components/auth/account-menu";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import type { AccountMenuUser } from "@/lib/auth/account-menu-user";
import { cn } from "@/lib/utils";

const DESKTOP_MEDIA_QUERY = "(min-width: 1280px)";

type GenerationHistoryShellProps = {
  accountUser?: AccountMenuUser | null;
  children: React.ReactNode;
};

export function GenerationHistoryShell({
  accountUser,
  children,
}: GenerationHistoryShellProps) {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = useEffectEvent(() => {
    setIsDrawerOpen(false);
  });

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    function syncDrawerState(matches: boolean) {
      setIsDesktop(matches);
      setIsDrawerOpen(matches);
    }

    syncDrawerState(mediaQuery.matches);

    function handleMediaQueryChange(event: MediaQueryListEvent) {
      syncDrawerState(event.matches);
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname && !isDesktop) {
      closeDrawer();
    }

    previousPathnameRef.current = pathname;
  }, [isDesktop, pathname]);

  useEffect(() => {
    if (isDesktop || !isDrawerOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDesktop, isDrawerOpen]);

  useEffect(() => {
    if (!isDesktop && isDrawerOpen) {
      dialogRef.current?.focus();
      restoreFocusRef.current = true;
      return;
    }

    if (restoreFocusRef.current) {
      triggerRef.current?.focus();
      restoreFocusRef.current = false;
    }
  }, [isDesktop, isDrawerOpen]);

  const toggleLabel = isDrawerOpen
    ? "Close navigation menu"
    : "Open navigation menu";

  return (
    <div
      data-testid="generation-history-shell"
      className="flex min-h-screen w-full bg-background text-foreground"
    >
      {isDesktop ? (
        <div
          className={cn(
            "shrink-0 overflow-hidden transition-[width] duration-200 ease-out",
            isDrawerOpen ? "w-[288px]" : "w-0",
          )}
        >
          {isDrawerOpen ? (
            <AppSidebar className="h-screen w-[288px] border-r border-border" />
          ) : null}
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 lg:px-8 backdrop-blur">
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            size="sm"
            className="size-9 p-0"
            aria-expanded={isDrawerOpen}
            aria-label={toggleLabel}
            onClick={() => setIsDrawerOpen((currentOpen) => !currentOpen)}
          >
            <Menu className="size-4" />
          </Button>
          {accountUser ? (
            <AccountMenu user={accountUser} variant="compact" />
          ) : (
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Generation history
            </p>
          )}
        </div>

        <main
          data-testid="generation-history-content"
          className="min-w-0 flex-1"
        >
          {children}
        </main>
      </div>

      {!isDesktop && isDrawerOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            data-testid="drawer-backdrop"
            className="absolute inset-0 bg-slate-950/45"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-[352px]">
            <div
              ref={dialogRef}
              id="generation-history-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              tabIndex={-1}
              className="h-full outline-none"
            >
              <AppSidebar className="h-full w-full border-r border-border shadow-[0_24px_60px_rgba(15,23,42,0.18)]" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
