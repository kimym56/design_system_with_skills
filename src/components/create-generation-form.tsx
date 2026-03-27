"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowUpRight } from "lucide-react";

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
import {
  COMPONENT_TYPE_SUMMARIES,
  CORE_COMPONENT_TYPES,
  type CoreComponentType,
} from "@/lib/catalog/component-types";
import { GenerationCodePanel } from "@/components/generation-code-panel";
import { GenerationPreviewFrame } from "@/components/generation-preview-frame";
import { SkillMultiSelect } from "@/components/skill-multi-select";

type SkillOption = {
  id: string;
  name: string;
  description: string | null;
  githubStars: number;
};

type QuotaPayload = {
  remaining: number | null;
  usedToday: number;
  limit: number | null;
  isUnlimited?: boolean;
};

type GenerationPayload = {
  resultCode: string;
  previewPayload: {
    html?: string;
  };
  rationale?: string | null;
};

export function CreateGenerationForm() {
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [componentType, setComponentType] = useState<CoreComponentType>("Button");
  const [quota, setQuota] = useState<QuotaPayload | null>(null);
  const [generation, setGeneration] = useState<GenerationPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    startTransition(async () => {
      try {
        const response = await fetch("/api/skills");
        const payload = await response.json();

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(payload.error ?? "Unable to load skills.");
          return;
        }

        setSkills(payload.skills);
        setQuota(payload.quota);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load skills.",
          );
        }
      }
    });

    return () => {
      active = false;
    };
  }, []);

  function toggleSkill(skillId: string) {
    setSelectedSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            componentType,
            skillIds: selectedSkillIds,
          }),
        });
        const payload = await response.json();

        if (!response.ok) {
          setGeneration(null);
          setError(payload.error ?? "Generation failed.");
          if (payload.quota) {
            setQuota(payload.quota);
          }
          return;
        }

        setGeneration(payload.generation);
        setQuota(payload.quota);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Generation failed.",
        );
      }
    });
  }

  const quotaLabel = quota
    ? quota.isUnlimited
      ? "Open access enabled"
      : `${quota.remaining} of ${quota.limit} runs left today`
    : "Checking workspace quota";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <section className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader className="space-y-3">
              <Badge variant="outline">Approved catalog</Badge>
              <div className="space-y-1">
                <CardTitle>Curated inputs only</CardTitle>
                <CardDescription>
                  Generation runs only against approved UI and UX skills.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="space-y-3">
              <Badge variant="outline">Quota</Badge>
              <div className="space-y-1">
                <CardTitle>{quotaLabel}</CardTitle>
                <CardDescription>
                  Output stays inside the fixed preview runtime before it lands
                  in history.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/70 bg-secondary/50">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge variant="outline">Input</Badge>
                <div className="space-y-1">
                  <CardTitle>Generation inputs</CardTitle>
                  <CardDescription>
                    Choose one component type and approved skills.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary">Safe runtime</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Component type
                </label>
                <select
                  value={componentType}
                  onChange={(event) =>
                    setComponentType(event.target.value as CoreComponentType)
                  }
                  className="h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {CORE_COMPONENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <p className="text-sm leading-6 text-muted-foreground">
                  {COMPONENT_TYPE_SUMMARIES[componentType]}
                </p>
              </div>

              <Separator className="bg-border/70" />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-foreground">
                    Approved skills
                  </label>
                  <Badge variant="secondary">Published catalog only</Badge>
                </div>
                <SkillMultiSelect
                  options={skills}
                  selectedIds={selectedSkillIds}
                  onToggle={toggleSkill}
                />
              </div>

              {error ? (
                <div className="rounded-[1.25rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="w-full justify-between sm:w-auto"
                disabled={isPending || selectedSkillIds.length === 0}
              >
                {isPending ? "Generating..." : "Generate run"}
                <ArrowUpRight className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6">
        <Card className="shadow-none">
          <CardHeader className="space-y-3">
            <div className="space-y-3">
              <Badge variant="outline">Rendered</Badge>
              <div className="space-y-1">
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Rendered output inside the isolated preview runtime.
                </CardDescription>
              </div>
            </div>
            <CardDescription>
              Inspect layout, spacing, and interaction before saving the run.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenerationPreviewFrame markup={generation?.previewPayload?.html ?? null} />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="space-y-3">
            <div className="space-y-3">
              <Badge variant="outline">Source</Badge>
              <div className="space-y-1">
                <CardTitle>Generated code</CardTitle>
                <CardDescription>
                  Review the exact code returned for this component run.
                </CardDescription>
              </div>
            </div>
            <CardDescription>
              Keep implementation details visible alongside the preview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenerationCodePanel code={generation?.resultCode ?? null} />
          </CardContent>
        </Card>

        {generation?.rationale ? (
          <Card className="shadow-none">
            <CardHeader className="space-y-2">
              <Badge variant="outline">Model notes</Badge>
              <CardTitle>Generation rationale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                {generation.rationale}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
