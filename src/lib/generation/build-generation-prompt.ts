export function buildGenerationPrompt(input: {
  componentType: string;
  selectedSkillNames: string[];
  styleCues: string[];
  summaries: string[];
}) {
  return [
    "Generate exactly one design system component.",
    `Component type: ${input.componentType}.`,
    `Selected skills: ${input.selectedSkillNames.join(", ")}.`,
    `Style cues: ${input.styleCues.join(", ")}.`,
    `Skill summaries: ${input.summaries.join(" | ") || "None provided."}.`,
    "Output target: Next.js App Router, TypeScript, Tailwind CSS.",
    "Rules: no external npm packages, no network calls, no fetch, no browser storage APIs, no server-only APIs.",
    "Return a single exported React component and a short rationale.",
  ].join("\n");
}
