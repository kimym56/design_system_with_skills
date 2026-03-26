import OpenAI from "openai";

import { buildGenerationPrompt } from "@/lib/generation/build-generation-prompt";
import {
  generatedComponentSchema,
  type GeneratedComponent,
} from "@/lib/generation/generation-schema";

function parseJsonPayload(raw: string) {
  const trimmed = raw.trim();

  if (trimmed.startsWith("```")) {
    const withoutFence = trimmed
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "");
    return JSON.parse(withoutFence);
  }

  return JSON.parse(trimmed);
}

export async function generateComponentArtifact(
  input: Parameters<typeof buildGenerationPrompt>[0],
): Promise<GeneratedComponent> {
  const { getEnv } = await import("@/lib/env");
  const client = new OpenAI({
    apiKey: getEnv().OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: "gpt-5.4",
    input: [
      {
        role: "developer",
        content: [
          {
            type: "input_text",
            text: [
              buildGenerationPrompt(input),
              "",
              "Return valid JSON with keys: componentName, code, previewMarkup, rationale.",
              "previewMarkup must be safe static HTML that represents the generated component visually.",
            ].join("\n"),
          },
        ],
      },
    ],
    text: {
      verbosity: "medium",
    },
  });

  return generatedComponentSchema.parse(parseJsonPayload(response.output_text));
}
