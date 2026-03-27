"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GenerationCodePanel } from "@/components/generation-code-panel";
import { GenerationPreviewFrame } from "@/components/generation-preview-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="border-destructive/15 bg-destructive/5 shadow-none">
        <CardContent className="p-5 text-sm leading-6 text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!generation) {
    return (
      <Card className="shadow-none">
        <CardContent className="space-y-3 p-6">
          <Badge variant="secondary">Opening run</Badge>
          <p className="text-sm leading-6 text-muted-foreground">
            Loading saved result...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <Badge variant="outline">Saved run</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
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

      <Card className="shadow-none">
        <CardHeader className="border-b border-border/70 bg-secondary/50">
          <CardTitle>Saved run summary</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Approved inputs and model output captured for this generation.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,0.56fr)_minmax(0,1fr)]">
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
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Approved skills
            </p>
            <div className="flex flex-wrap gap-2">
              {generation.selectedSkills.map(({ skill }) => (
                <Badge key={skill.id} variant="outline">
                  {skill.name}
                </Badge>
              ))}
            </div>
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="shadow-none">
          <CardHeader className="space-y-3">
            <Badge variant="outline">Rendered</Badge>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <GenerationPreviewFrame
              markup={generation.previewPayload?.html ?? null}
            />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="space-y-3">
            <Badge variant="outline">Source</Badge>
            <CardTitle>Generated code</CardTitle>
          </CardHeader>
          <CardContent>
            <GenerationCodePanel code={generation.resultCode} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
