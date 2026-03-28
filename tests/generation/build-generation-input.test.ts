import { expect, test } from "vitest";

import { buildGenerationInput } from "@/lib/generation/build-generation-input";

test("generation input includes the selected component type and normalized skills", () => {
  const result = buildGenerationInput({
    componentType: "Button",
    skills: [
      { name: "minimalist-ui", styleCues: ["minimal", "clean"] },
      { name: "taste-skill", styleCues: ["bold", "structured"] },
    ],
  });

  expect(result.componentType).toBe("Button");
  expect(result.styleCues).toContain("minimal");
  expect(result.styleCues).toContain("bold");
});
