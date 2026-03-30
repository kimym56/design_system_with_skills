"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  GitBranch,
  Globe,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    title: "Generation workspace",
    body: "Choose a component type, layer approved skills, and review preview plus code in one pass.",
  },
  {
    title: "Saved runs history",
    body: "Keep the strongest generations close so promising directions stay easy to revisit and compare.",
  },
  {
    title: "Custom (TBD)",
    body: "Reserved for future team-specific workflows, evaluation surfaces, and deeper system extensions.",
  },
] as const;

const specimenSkills = [
  "minimalist-skill",
  "taste-skill",
  "stitch-skill",
] as const;

const codeSample = [
  "export function GeneratedButton() {",
  "  return (",
  '    <button className="rounded-full bg-neutral-950 px-6 py-3',
  '      text-sm font-medium text-white shadow-sm">',
  "      Generate component",
  "    </button>",
  "  );",
  "}",
].join("\n");

const landingPageBackgroundClass = "landing-page-background";

type LandingPageShellProps = {
  isSignedIn: boolean;
};

export function LandingPageShell({ isSignedIn }: LandingPageShellProps) {
  const mainGoogleButtonRef = useRef<HTMLButtonElement>(null);
  const [isCompactBrand, setIsCompactBrand] = useState(false);
  const [isGoogleCtaHighlighted, setIsGoogleCtaHighlighted] = useState(false);
  const syncBrandState = useEffectEvent(() => {
    setIsCompactBrand(window.scrollY > 40);
  });

  useEffect(() => {
    syncBrandState();
    window.addEventListener("scroll", syncBrandState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncBrandState);
    };
  }, []);

  useEffect(() => {
    if (!isGoogleCtaHighlighted) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsGoogleCtaHighlighted(false);
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isGoogleCtaHighlighted]);

  function handleTryDSSkillsClick() {
    const button = mainGoogleButtonRef.current;

    if (!button) {
      return;
    }

    button.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    button.focus();
    setIsGoogleCtaHighlighted(true);
  }

  return (
    <main
      className={cn("min-h-screen text-foreground", landingPageBackgroundClass)}
      data-testid="landing-page-root"
    >
      <header
        className={cn(
          "sticky top-0 z-30 rounded-none transition-[padding] duration-200",
          landingPageBackgroundClass,
        )}
        data-testid="landing-topbar"
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-[-0.03em] text-slate-950"
          >
            {isCompactBrand ? "DSSkills" : "Design System Skills"}
          </Link>

          {isSignedIn ? (
            <Button asChild className="px-4" size="sm" variant="outline">
              <Link href="/workspace">
                Try DSSkills
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button
              className="px-4"
              onClick={handleTryDSSkillsClick}
              size="sm"
              type="button"
              variant="outline"
            >
              Try DSSkills
              <ArrowUpRight className="size-4" />
            </Button>
          )}
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-[1440px] flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex-1 py-6 sm:py-8 lg:py-10">
          <section className="grid gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(460px,0.96fr)] lg:items-center lg:gap-14">
            <div className="max-w-2xl space-y-6 lg:space-y-7">
              <div className="space-y-4">
                <h1 className="text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-[4.6rem]">
                  Design System UI, tested in one workspace.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Sign in with Google to generate components, inspect preview
                  and code, and keep the strongest runs close.
                </p>
              </div>

              {isSignedIn ? (
                <Button asChild className="rounded-full px-5" size="lg">
                  <Link href="/workspace">
                    Open workspace
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <GoogleSignInButton
                  ref={mainGoogleButtonRef}
                  callbackUrl="/workspace"
                  className={cn(
                    "scroll-mt-28 rounded-full px-5 shadow-[0_14px_30px_rgba(15,23,42,0.12)]",
                    isGoogleCtaHighlighted ? "landing-cta-pulse" : undefined,
                  )}
                  data-highlighted={isGoogleCtaHighlighted ? "true" : "false"}
                  size="lg"
                >
                  Sign in with Google
                </GoogleSignInButton>
              )}
            </div>

            <Card className="overflow-hidden border-slate-900/8 bg-white/90 shadow-[0_26px_80px_rgba(15,23,42,0.10)]">
              <CardHeader className="gap-4 border-b border-slate-900/8 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.92))]">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                      Workspace specimen
                    </p>
                    <CardTitle className="text-[1.75rem] tracking-[-0.04em] text-slate-950">
                      DSSkills in motion
                    </CardTitle>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-slate-900/8 bg-slate-100/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
                    Product frame
                  </span>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-500">
                  A static view of the real generation flow: select inputs, run
                  a component generation, and inspect preview plus code.
                </p>
              </CardHeader>

              <CardContent className="grid gap-4 bg-[linear-gradient(180deg,_rgba(247,248,250,0.78),_rgba(255,255,255,0.98))] pt-6">
                <div className="rounded-[calc(var(--radius-card)-2px)] border border-slate-900/8 bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-900/8 px-4 py-4">
                    <div>
                      <p className="text-base font-semibold tracking-[-0.03em] text-slate-950">
                        Generation inputs
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Choose a component and approved skills before running
                        generation.
                      </p>
                    </div>
                    <Sparkles className="size-4 text-slate-400" />
                  </div>

                  <div className="grid gap-3 px-4 py-4 md:grid-cols-[0.85fr_1.2fr_0.9fr] md:items-end">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        Component type
                      </p>
                      <div className="flex h-11 items-center rounded-[var(--radius-control)] border border-slate-900/8 bg-slate-50 px-3 text-sm text-slate-700">
                        Button
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        Approved skills
                      </p>
                      <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-[var(--radius-control)] border border-slate-900/8 bg-slate-50 px-3 py-2">
                        {specimenSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-full border border-slate-900/8 bg-white px-2.5 py-1 text-[11px] font-medium tracking-[0.01em] text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      className="w-full justify-between rounded-[var(--radius-control)]"
                      disabled
                      type="button"
                    >
                      Generate run
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[0.94fr_1.06fr]">
                  <div className="rounded-[calc(var(--radius-card)-2px)] border border-slate-900/8 bg-white">
                    <div className="border-b border-slate-900/8 px-4 py-4">
                      <p className="text-base font-semibold tracking-[-0.03em] text-slate-950">
                        Preview
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Inspect the rendered component before saving the run.
                      </p>
                    </div>

                    <div className="px-4 py-4">
                      <div className="rounded-[var(--radius-card)] border border-slate-900/8 bg-[linear-gradient(180deg,_#f8fbff,_#eef2f7)] p-4">
                        <div className="rounded-[var(--radius-card)] border border-slate-900/8 bg-white px-6 py-10">
                          <div className="flex justify-center rounded-[var(--radius-card)] bg-slate-100/80 px-6 py-10">
                            <button className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-sm">
                              Generate component
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[calc(var(--radius-card)-2px)] border border-slate-900/8 bg-[#0f172a] text-slate-50">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                      <p className="text-base font-semibold tracking-[-0.03em] text-white">
                        Generated code
                      </p>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        React
                      </span>
                    </div>
                    <div className="px-4 py-4">
                      <pre className="overflow-x-auto text-sm leading-6 text-slate-100">
                        <code>{codeSample}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-16 grid gap-4 md:grid-cols-3">
            {featureCards.map((card) => (
              <Card
                key={card.title}
                className="border-slate-900/8 bg-white/88 shadow-[0_10px_32px_rgba(15,23,42,0.05)]"
              >
                <CardHeader className="gap-3">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                    Product surface
                  </p>
                  <CardTitle className="text-2xl tracking-[-0.04em] text-slate-950">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">
                    {card.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>

        <footer className="border-t border-slate-900/8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              © 2026 YongMin Kim. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              <Button
                asChild
                className="size-10 rounded-full p-0"
                variant="outline"
              >
                <a aria-label="Email" href="mailto:kimym.svb@gmail.com">
                  <Mail className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                className="size-10 rounded-full p-0"
                variant="outline"
              >
                <a
                  aria-label="GitHub"
                  href="https://github.com/kimym56/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <GitBranch className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                className="size-10 rounded-full p-0"
                variant="outline"
              >
                <a
                  aria-label="LinkedIn"
                  href="https://linkedin.com/in/kimym56"
                  rel="noreferrer"
                  target="_blank"
                >
                  <BriefcaseBusiness className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                className="size-10 rounded-full p-0"
                variant="outline"
              >
                <a
                  aria-label="Website"
                  href="https://ymkim-portfolio.vercel.app"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Globe className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
