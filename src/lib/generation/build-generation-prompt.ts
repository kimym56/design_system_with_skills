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
    "Preview runtime: isolated iframe document without Tailwind CSS.",
    "previewMarkup must be self-contained and visually match the default render of the component.",
    "Use inline styles or a <style> block inside previewMarkup.",
    "Do not rely on Tailwind classes or external stylesheets in previewMarkup.",
    "Rules: no external npm packages, no network calls, no fetch, no browser storage APIs, no server-only APIs.",
    "Return a single exported React component and a short rationale.",
  ].join("\n");
}
