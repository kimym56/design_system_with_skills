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
import { type CoreComponentType } from "@/lib/catalog/component-types";
import { GenerationResultViewer } from "@/components/generation-result-viewer";
import { ComponentTypeSelect } from "@/components/component-type-select";
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

type FormErrorState = {
  message: string;
  details: string[];
};

function getFormErrorState(payload: unknown, fallbackMessage: string): FormErrorState {
  if (!payload || typeof payload !== "object") {
    return {
      message: fallbackMessage,
      details: [],
    };
  }

  const payloadRecord = payload as {
    error?: unknown;
    details?: unknown;
  };

  return {
    message:
      typeof payloadRecord.error === "string"
        ? payloadRecord.error
        : fallbackMessage,
    details: Array.isArray(payloadRecord.details)
      ? payloadRecord.details.filter(
          (detail): detail is string => typeof detail === "string",
        )
      : [],
  };
}

export function CreateGenerationForm() {
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [componentType, setComponentType] = useState<CoreComponentType>("Button");
  const [quota, setQuota] = useState<QuotaPayload | null>(null);
  const [generation, setGeneration] = useState<GenerationPayload | null>(null);
  const [error, setError] = useState<FormErrorState | null>(null);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isGenerating, startGenerationTransition] = useTransition();
  const isSubmissionLocked = isGenerating || isLoadingSkills;

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
          setError(getFormErrorState(payload, "Unable to load skills."));
          return;
        }

        setSkills(payload.skills);
        setQuota(payload.quota);
      } catch (requestError) {
        if (active) {
          setError({
            message:
              requestError instanceof Error
                ? requestError.message
                : "Unable to load skills.",
            details: [],
          });
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
    setGeneration(null);

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
          setError(getFormErrorState(payload, "Generation failed."));
          if (payload.quota) {
            setQuota(payload.quota);
          }
          return;
        }

        setGeneration(payload.generation);
        setQuota(payload.quota);
      } catch (requestError) {
        setError({
          message:
            requestError instanceof Error
              ? requestError.message
              : "Generation failed.",
          details: [],
        });
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
          <CardHeader className="rounded-t-[calc(var(--radius-card)-1px)] bg-white">
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
                  <p
                    id="component-type-label"
                    className="text-sm font-medium text-foreground"
                  >
                    Component type
                  </p>
                  <ComponentTypeSelect
                    key={`component-type-${isSubmissionLocked ? "locked" : "ready"}`}
                    value={componentType}
                    onSelect={setComponentType}
                    labelId="component-type-label"
                    disabled={isSubmissionLocked}
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <p
                    id="approved-skills-label"
                    className="text-sm font-medium text-foreground"
                  >
                    Approved skills
                  </p>
                  <SkillMultiSelect
                    key={`approved-skills-${isSubmissionLocked ? "locked" : "ready"}`}
                    options={skills}
                    selectedIds={selectedSkillIds}
                    onToggle={toggleSkill}
                    labelId="approved-skills-label"
                    disabled={isSubmissionLocked}
                  />
                </div>

                <div className="xl:w-[180px]">
                  <Button
                    type="submit"
                    className="w-full justify-between"
                    disabled={
                      isSubmissionLocked || selectedSkillIds.length === 0
                    }
                  >
                    {isGenerating ? "Generating..." : "Generate run"}
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              </div>

              {error ? (
                <div className="rounded-[var(--radius-control)] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  <p>{error.message}</p>
                  {error.details.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-xs leading-5 text-destructive/90">
                      {error.details.map((detail) => (
                        <li key={detail} className="break-words">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  ) : null}
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
          isLoading={isGenerating}
          componentType={componentType}
        />
      </section>
    </div>
  );
}
