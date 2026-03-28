"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CORE_COMPONENT_TYPES,
  type CoreComponentType,
} from "@/lib/catalog/component-types";
import { GenerationResultViewer } from "@/components/generation-result-viewer";
import { SkillMultiSelect } from "@/components/skill-multi-select";

type SkillOption = {
  id: string;
  name: string;
  title: string;
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
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isGenerating, startGenerationTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function loadSkills() {
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
      } finally {
        if (active) {
          setIsLoadingSkills(false);
        }
      }
    }

    void loadSkills();

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

    startGenerationTransition(async () => {
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
    : isLoadingSkills
      ? "Checking workspace quota"
      : "Workspace quota unavailable";

  return (
    <div className="space-y-4">
      <section>
        <Card className="shadow-none">
          <CardHeader className="bg-white">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:items-center">
              <div className="min-w-0 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <CardTitle>Generation inputs</CardTitle>
                <CardDescription className="max-w-none text-xs sm:text-sm">
                  Choose a component type, select approved skills, and run generation.
                </CardDescription>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">{quotaLabel}</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
                <div className="space-y-2 xl:w-[220px]">
                  <label
                    htmlFor="component-type"
                    className="text-sm font-medium text-foreground"
                  >
                    Component type
                  </label>
                  <select
                    id="component-type"
                    value={componentType}
                    onChange={(event) =>
                      setComponentType(event.target.value as CoreComponentType)
                    }
                    className="h-9 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {CORE_COMPONENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <p
                    id="approved-skills-label"
                    className="text-sm font-medium text-foreground"
                  >
                    Approved skills
                  </p>
                  <SkillMultiSelect
                    options={skills}
                    selectedIds={selectedSkillIds}
                    onToggle={toggleSkill}
                    labelId="approved-skills-label"
                  />
                </div>

                <div className="xl:w-[180px]">
                  <Button
                    type="submit"
                    className="w-full justify-between"
                    disabled={
                      isGenerating || isLoadingSkills || selectedSkillIds.length === 0
                    }
                  >
                    {isGenerating ? "Generating..." : "Generate run"}
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              </div>

              {error ? (
                <div className="rounded-[12px] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <GenerationResultViewer
          code={generation?.resultCode ?? null}
          markup={generation?.previewPayload?.html ?? null}
        />

        {generation?.rationale ? (
          <Card className="shadow-none">
            <CardContent className="p-5 sm:p-6">
              <p className="text-sm font-medium text-foreground">
                Generation rationale
              </p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {generation.rationale}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
