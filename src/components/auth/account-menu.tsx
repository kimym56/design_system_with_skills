"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AccountMenuUser } from "@/lib/auth/account-menu-user";

type AccountMenuProps = {
  user: AccountMenuUser;
  variant: "homepage" | "compact";
};

function getDisplayName(user: AccountMenuUser) {
  if (user.name?.trim()) {
    return user.name.trim();
  }

  if (user.email?.trim()) {
    return user.email.trim().split("@")[0] ?? "Account";
  }

  return "Account";
}

function getShortName(user: AccountMenuUser) {
  return getDisplayName(user).split(/\s+/)[0] ?? "Account";
}

function getInitials(user: AccountMenuUser) {
  const displayName = getDisplayName(user);
  const parts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }

  return displayName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "A";
}

function AccountAvatar({ user }: { user: AccountMenuUser }) {
  const displayName = getDisplayName(user);

  if (user.image) {
    return (
      <img
        alt={`${displayName} avatar`}
        className="size-8 rounded-full object-cover"
        referrerPolicy="no-referrer"
        src={user.image}
      />
    );
  }

  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold uppercase tracking-[0.08em] text-background">
      {getInitials(user)}
    </span>
  );
}

export function AccountMenu({ user, variant }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayName = getDisplayName(user);
  const shortName = getShortName(user);

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
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "border-border text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-primary/20",
          variant === "homepage"
            ? "h-auto rounded-[14px] bg-background px-3 py-2.5 hover:bg-secondary/70"
            : "h-auto rounded-[12px] bg-card px-2.5 py-1.5 hover:bg-secondary/70",
        )}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
        variant="outline"
      >
        <AccountAvatar user={user} />
        <span className="flex flex-col items-start leading-none">
          <span className="text-sm font-medium">{variant === "homepage" ? displayName : shortName}</span>
          {variant === "homepage" ? (
            <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Account
            </span>
          ) : null}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </Button>

      {isOpen ? (
        <div
          className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-[260px] rounded-[16px] border border-border bg-card p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          data-testid="account-menu-panel"
        >
          <div className="flex items-center gap-3 border-b border-border px-1 pb-3">
            <AccountAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              {user.email ? (
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-3 grid gap-1">
            <Button
              asChild
              className="justify-start rounded-[10px] px-3"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <Link href="/workspace">Workspace</Link>
            </Button>
            <Button
              asChild
              className="justify-start rounded-[10px] px-3"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <Link href="/history">History</Link>
            </Button>
            <Button
              className="justify-start rounded-[10px] px-3"
              onClick={() => {
                setIsOpen(false);
                void signOut({ callbackUrl: "/" });
              }}
              variant="ghost"
            >
              Sign out
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
