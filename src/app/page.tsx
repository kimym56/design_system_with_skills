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
    label: "Skill composition",
    body: "Combine approved agent skills to shape how new design system components are generated.",
  },
  {
    label: "Preview and code",
    body: "Inspect the generated component in code and preview form before keeping the run.",
  },
  {
    label: "Saved runs",
    body: "Keep successful generations nearby so useful component directions are easy to revisit.",
  },
];

const selectedWork = [
  {
    title: "Generation workspace",
    category: "Evaluation surface",
    body: "Configure component type and approved skills, then generate a run with the exact inputs in view.",
  },
  {
    title: "Saved runs history",
    category: "Review surface",
    body: "Return to earlier outputs to inspect how new skill combinations changed the generated UI.",
  },
];

const operatingPrinciples = [
  "Use approved skills to steer component structure, styling, and output quality.",
  "Keep code and preview in the same loop so generated components can be judged quickly.",
  "Save useful runs so design system directions stay easy to revisit and refine.",
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
              Agent Skill Component Generator
            </p>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Generate design system components by combining approved agent skills.
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
              <Badge variant="secondary">Generation workflow</Badge>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                  Generate design system components with agent skills.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  Select a component type, combine approved skills, and produce
                  new design system UI with code and preview output ready for
                  review.
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
                    Workspace specimen
                  </p>
                  <CardTitle className="mt-2 text-2xl">
                    Generate a component run
                  </CardTitle>
                </div>
                <Badge variant="secondary">Skill-driven output</Badge>
              </div>
              <CardDescription>
                Select a component, choose approved skills, and generate output
                that can be reviewed, refined, and saved.
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
                        Choose a component type, select approved skills, and start a new component generation run.
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      Generation ready
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
                      Review the rendered component inside the isolated preview runtime.
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
                Evaluation surfaces
              </p>
              <CardTitle className="text-3xl tracking-[-0.04em] sm:text-4xl">
                The full generation loop stays visible from input to saved output.
              </CardTitle>
              <CardDescription className="max-w-2xl">
                Each surface supports the same job: compose skills, generate a
                component, inspect the result, and keep useful runs available.
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
                Review rules
              </p>
              <CardTitle className="text-3xl tracking-[-0.04em] sm:text-4xl">
                Agent skills should produce components that are ready to inspect.
              </CardTitle>
              <CardDescription>
                The landing page should explain how generated components move
                from prompt inputs to usable output.
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
              Start generating
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              Open the workspace and generate design system components with the
              agent skills you want to test.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              Move into the generation environment that handles inputs, preview,
              review, and saved runs.
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
