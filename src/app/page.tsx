import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { getServerAuthSession } from "@/auth";
import { AccountMenu } from "@/components/auth/account-menu";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toAccountMenuUser } from "@/lib/auth/account-menu-user";

const evidenceCards = [
  {
    label: "Shipped surfaces",
    body: "Workspace, history, and auth states designed as one coherent product system.",
  },
  {
    label: "System thinking",
    body: "Panels, spacing, and state hierarchy stay aligned across public and private routes.",
  },
  {
    label: "Code-backed UI",
    body: "Interface decisions are carried through the actual React and Tailwind implementation.",
  },
];

const selectedWork = [
  {
    title: "Generation workspace",
    category: "Input flow",
    body: "Turns component selection, approved skills, and results into one controlled working surface.",
  },
  {
    title: "Saved runs history",
    category: "State continuity",
    body: "Keeps previous generations readable, dense, and easy to revisit without losing context.",
  },
];

const operatingPrinciples = [
  "Design the system state before styling the surface.",
  "Keep the public route visually related to the authenticated tool.",
  "Make proof visible in the interface, not only in the copy.",
];

const specimenSkills = ["minimalist-skill", "taste-skill", "stitch-skill"];

const codeSample = [
  "export function GeneratedButton() {",
  "  return (",
  "    <button className=\"rounded-full bg-primary px-6 py-3",
  "      text-sm font-medium text-primary-foreground\">",
  "      Generate component",
  "    </button>",
  "  );",
  "}",
].join("\n");

export default async function Home() {
  const session = await getServerAuthSession();
  const accountUser = toAccountMenuUser(session?.user);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-4 sm:px-6 sm:py-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card px-5 py-5 shadow-[0_18px_50px_rgba(9,9,11,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Design Engineer
            </p>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Entry surface for the same product system behind the workspace
              and saved runs.
            </p>
          </div>

          {accountUser ? (
            <AccountMenu user={accountUser} variant="homepage" />
          ) : (
            <GoogleSignInButton callbackUrl="/workspace" variant="outline">
              Sign in with Google
              <ArrowUpRight className="size-4" />
            </GoogleSignInButton>
          )}
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge variant="secondary">Working surface</Badge>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                  Product systems with working surfaces.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  I design and ship interface systems that stay coherent from
                  the entry surface to the working product surface.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/workspace">
                  Open workspace
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              {accountUser ? (
                <Button asChild size="lg" variant="outline">
                  <Link href="/history">
                    View saved runs
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <GoogleSignInButton
                  callbackUrl="/workspace"
                  size="lg"
                  variant="outline"
                >
                  Sign in with Google
                </GoogleSignInButton>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {evidenceCards.map((item) => (
                <Card key={item.label} className="shadow-none">
                  <div
                    data-testid="landing-evidence-card"
                    className="space-y-1.5 px-3.5 py-3 sm:px-3.5 sm:py-3"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm leading-5 text-foreground">{item.body}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden shadow-none">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Live workspace specimen
                  </p>
                  <CardTitle className="mt-2 text-2xl">
                    Run a component generation
                  </CardTitle>
                </div>
                <Badge variant="secondary">Workspace view</Badge>
              </div>
              <CardDescription>
                Select a component, choose approved skills, and review the
                output before saving the run.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4">
                <div className="rounded-[1.25rem] border border-border bg-card">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-white px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                        Generation inputs
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Choose a component type, select approved skills, and run generation.
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      Open access enabled
                    </p>
                  </div>
                  <div className="grid gap-3 px-4 py-4 md:grid-cols-[0.9fr_1.25fr_0.85fr] md:items-end">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Component type
                      </p>
                      <div className="h-11 rounded-[12px] border border-input bg-background" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Approved skills
                      </p>
                      <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-[12px] border border-input bg-background px-3 py-2">
                        {specimenSkills.map((skill) => (
                          <Badge key={skill} variant="default">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button type="button" className="w-full justify-between" disabled>
                      Generate run
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-border bg-card">
                  <div className="border-b border-border px-4 py-4">
                    <p className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                      Generated result
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Rendered output inside the isolated preview runtime.
                    </p>
                  </div>
                  <div className="grid gap-4 px-4 py-4 md:grid-cols-[1.02fr_0.98fr]">
                    <div className="rounded-[1rem] bg-code-surface p-4 text-code-foreground">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          Generated code
                        </p>
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          React
                        </span>
                      </div>
                      <pre className="mt-4 overflow-x-auto text-sm leading-6 text-slate-100">
                        <code>{codeSample}</code>
                      </pre>
                    </div>

                    <div className="rounded-[1rem] border border-border bg-background p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Preview
                      </p>
                      <div className="mt-4 rounded-[1rem] border border-border bg-card p-5">
                        <div className="flex justify-center rounded-[0.875rem] bg-accent px-6 py-10">
                          <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
                            Generate component
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="overflow-hidden shadow-none">
            <CardHeader className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                Core surfaces
              </p>
              <CardTitle className="text-3xl tracking-[-0.04em] sm:text-4xl">
                A few surfaces carrying the same system language.
              </CardTitle>
              <CardDescription className="max-w-2xl">
                Each surface is designed as part of one working product rather
                than as isolated mockups.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {selectedWork.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.25rem] border border-border bg-background p-5"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {item.category}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-muted/50 shadow-none">
            <CardHeader className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                Operating principles
              </p>
              <CardTitle className="text-3xl tracking-[-0.04em] sm:text-4xl">
                Design engineering stays visible in the system choices.
              </CardTitle>
              <CardDescription>
                The public route should explain how the work is made, not only
                what it looks like.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {operatingPrinciples.map((principle) => (
                <div
                  key={principle}
                  className="rounded-[1.25rem] border border-border bg-card px-4 py-4"
                >
                  <p className="text-sm leading-6 text-foreground">{principle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="grid gap-4 rounded-[2rem] border border-border bg-muted/50 px-6 py-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Enter the working surface
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              The landing page stays public. The workspace shows the system in its
              operational state.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              Move from the public surface into the same product environment
              that handles generation, review, and saved runs.
            </p>
          </div>

          <Button asChild size="lg">
            <Link href="/workspace">
              Enter workspace
              <CheckCircle2 className="size-4" />
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
