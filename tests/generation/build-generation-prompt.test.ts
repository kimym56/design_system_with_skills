import { expect, test } from "vitest";

import { buildGenerationPrompt } from "@/lib/generation/build-generation-prompt";

test("generation prompt requires a self-contained preview for the isolated runtime", () => {
  const prompt = buildGenerationPrompt({
    componentType: "Button",
    selectedSkillNames: ["frontend-design"],
    styleCues: ["frontend", "design"],
    summaries: ["A skill for component design."],
  });

  expect(prompt).toContain("Preview runtime: isolated iframe document without Tailwind CSS.");
  expect(prompt).toContain(
    "previewMarkup must be self-contained and visually match the default render of the component.",
  );
  expect(prompt).toContain(
    "Use inline styles or a <style> block inside previewMarkup.",
  );
  expect(prompt).toContain(
    "Do not rely on Tailwind classes or external stylesheets in previewMarkup.",
  );
});
