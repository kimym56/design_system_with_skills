"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GenerationResultViewer } from "@/components/generation-result-viewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type GenerationDetail = {
  id: string;
  componentType: string;
  rationale: string | null;
  resultCode: string;
  createdAt: string;
  model: string;
  previewPayload: {
    html?: string;
  };
  selectedSkills: Array<{
    skill: {
      id: string;
      name: string;
    };
  }>;
};

export default function GenerationDetailPage() {
  const params = useParams<{ generationId: string }>();
  const [generation, setGeneration] = useState<GenerationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`/api/history/${params.generationId}`)
      .then(async (response) => {
        const payload = await response.json();

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(payload.error ?? "Unable to load generation.");
          return;
        }

        setGeneration(payload.generation);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load generation.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [params.generationId]);

  if (error) {
    return (
      <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Card className="border-destructive/15 bg-destructive/5 shadow-none">
          <CardContent className="p-5 text-sm leading-6 text-destructive">
            {error}
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!generation) {
    return (
      <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Card className="shadow-none">
          <CardContent className="p-6 text-sm leading-6 text-muted-foreground">
            Loading saved result...
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            {generation.componentType}
          </h1>
          <p className="text-sm tracking-[0.01em] text-muted-foreground">
            {new Date(generation.createdAt).toLocaleString()} · {generation.model}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/history">
              <ArrowLeft className="size-4" />
              Back to history
            </Link>
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden shadow-none">
        <CardHeader className="gap-1 border-b border-border">
          <CardTitle>Saved run summary</CardTitle>
          <CardDescription className="max-w-2xl leading-6">
            Approved inputs and model output captured for this generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-x-8 gap-y-5 pt-5 sm:pt-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Recorded
              </p>
              <p className="text-sm text-foreground">
                {new Date(generation.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Model
              </p>
              <p className="text-sm text-foreground">{generation.model}</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Approved skills
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {generation.selectedSkills.map(({ skill }) => skill.name).join(" • ")}
            </p>
            {generation.rationale ? (
              <>
                <Separator className="bg-border/70" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {generation.rationale}
                </p>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <GenerationResultViewer
        code={generation.resultCode}
        markup={generation.previewPayload?.html ?? null}
      />
    </main>
  );
}
