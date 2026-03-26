"use client";

import { useEffect, useState, useTransition } from "react";

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
  remaining: number;
  usedToday: number;
  limit: number;
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

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-amber-300/15 px-3 py-2 text-xs font-medium uppercase tracking-[0.24em] text-amber-200">
            Safe Preview
          </span>
          {quota ? (
            <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.24em] text-stone-200">
              {quota.remaining} of {quota.limit} generations left today
            </span>
          ) : null}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white">
              Component type
            </label>
            <select
              value={componentType}
              onChange={(event) =>
                setComponentType(event.target.value as CoreComponentType)
              }
              className="w-full rounded-2xl border border-white/10 bg-stone-950 px-4 py-3 text-sm text-stone-100"
            >
              {CORE_COMPONENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <p className="text-sm leading-6 text-stone-300">
              {COMPONENT_TYPE_SUMMARIES[componentType]}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white">
                Select UI/UX skills
              </label>
              <span className="text-xs uppercase tracking-[0.2em] text-stone-400">
                Published catalog only
              </span>
            </div>
            <SkillMultiSelect
              options={skills}
              selectedIds={selectedSkillIds}
              onToggle={toggleSkill}
            />
          </div>

          {error ? (
            <div className="rounded-[1.25rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending || selectedSkillIds.length === 0}
            className="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-300"
          >
            {isPending ? "Generating..." : "Generate component"}
          </button>
        </form>
      </section>

      <section className="grid gap-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Rendered result</h2>
          <GenerationPreviewFrame markup={generation?.previewPayload?.html ?? null} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Component code</h2>
          <GenerationCodePanel code={generation?.resultCode ?? null} />
        </div>
      </section>
    </div>
  );
}
