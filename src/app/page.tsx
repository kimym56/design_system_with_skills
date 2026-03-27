import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

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

const trustSignals = [
  "Approved GitHub skill catalog",
  "Safe isolated preview",
  "Open access for now",
];

const workflowSteps = [
  {
    title: "Choose a component",
    body: "Start with one of the Core 12 components instead of an open-ended prompt.",
  },
  {
    title: "Select approved skills",
    body: "Shape the output with curated UI and UX skills that already passed your catalog rules.",
  },
  {
    title: "Review code and result",
    body: "Get a generated component, inspect the code, and compare it against a safe rendered preview.",
  },
];

const selectedSkills = ["minimalist-ui", "design-taste-frontend", "stitch-design-taste"];

const codeSample = [
  "export function SkillButton() {",
  "  return (",
  "    <button className=\"rounded-full bg-blue-700 px-5 py-3",
  "      text-sm font-medium text-white\">",
  "      Generate component",
  "    </button>",
  "  );",
  "}",
].join("\n");

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-4 sm:px-6 sm:py-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card px-5 py-5 shadow-[0_18px_50px_rgba(9,9,11,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Design System AI
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              Editorial component builder
            </h1>
          </div>

          <Button asChild variant="outline">
            <Link href="/api/auth/signin/google?callbackUrl=%2Fworkspace">
              Sign in with Google
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge>Approved skills only</Badge>
              <div className="space-y-4">
                <h2 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                  Generate design system components from selected UI skills.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  Open access is live right now. Pick a component type, combine
                  approved GitHub-published UI and UX skills, and review the
                  result in code and preview before it lands in history.
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
              <Button asChild size="lg" variant="outline">
                <Link href="/api/auth/signin/google?callbackUrl=%2Fworkspace">
                  Sign in with Google
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {trustSignals.map((signal) => (
                <Card key={signal} className="shadow-none">
                  <CardContent className="p-5">
                    <p className="text-sm leading-6 text-foreground">{signal}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Selection
                  </p>
                  <CardTitle className="mt-2 text-2xl">Button</CardTitle>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
              <CardDescription>
                Generated output stays inside a fixed runtime with a safe preview.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4 rounded-[1.25rem] border border-border bg-muted/60 p-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Selected skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <Badge key={skill} variant="default">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="size-4 text-primary" />
                      <p className="text-sm text-foreground">Safe isolated preview</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.25rem] bg-code-surface p-4 text-code-foreground">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        Generated code
                      </p>
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Next.js
                      </span>
                    </div>
                    <pre className="mt-4 overflow-x-auto text-sm leading-6 text-slate-100">
                      <code>{codeSample}</code>
                    </pre>
                  </div>

                  <div className="rounded-[1.25rem] border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Preview surface
                    </p>
                    <div className="mt-4 rounded-[1.25rem] border border-border bg-card p-6">
                      <div className="flex justify-center rounded-[1rem] bg-accent px-6 py-10">
                        <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
                          Generate component
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Simple workflow
            </p>
            <h3 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              From selected skills to a saved component in one controlled path.
            </h3>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              The landing page explains the system clearly: approved inputs,
              fixed output target, and a preview environment that stays inside
              the product boundary.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <Card key={step.title} className="shadow-none">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary">
                      0{index + 1}
                    </span>
                    <Sparkles className="size-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        <section className="grid gap-4 rounded-[2rem] border border-border bg-muted/50 px-6 py-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Direct sign-in CTA
            </p>
            <h3 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              Start with the approved catalog and move straight into the builder.
            </h3>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              Jump straight into the builder today, or sign in with Google if
              you want to keep using the existing account path while open
              access is enabled.
            </p>
          </div>

          <Button asChild size="lg">
            <Link href="/workspace">
              Open the builder
              <CheckCircle2 className="size-4" />
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
