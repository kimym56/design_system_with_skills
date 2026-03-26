"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { GenerationCodePanel } from "@/components/generation-code-panel";
import { GenerationPreviewFrame } from "@/components/generation-preview-frame";

type GenerationDetail = {
  id: string;
  componentType: string;
  rationale: string | null;
  resultCode: string;
  previewPayload: {
    html?: string;
  };
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
    return <div className="text-sm text-rose-200">{error}</div>;
  }

  if (!generation) {
    return <div className="text-sm text-stone-300">Loading generation...</div>;
  }

  return (
    <main className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-300">
          Generation Detail
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          {generation.componentType}
        </h1>
        {generation.rationale ? (
          <p className="max-w-2xl text-base leading-7 text-stone-300">
            {generation.rationale}
          </p>
        ) : null}
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GenerationPreviewFrame markup={generation.previewPayload?.html ?? null} />
        <GenerationCodePanel code={generation.resultCode} />
      </div>
    </main>
  );
}
