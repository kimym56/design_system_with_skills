import { expect, test } from "vitest";

import { buildSeededSkillData } from "@/lib/catalog/seeded-skill";

test("maps a locked skill entry to seeded catalog data with a real display name", () => {
  const result = buildSeededSkillData({
    slug: "taste-skill",
    skill: {
      source: "Leonxlnx/taste-skill",
      sourceType: "github",
      computedHash: "hash-123",
      aliases: ["design-taste-frontend"],
    },
  });

  expect(result.name).toBe("taste-skill");
  expect(result.slug).toBe("taste-skill");
  expect(result.sourceRepo).toBe("Leonxlnx/taste-skill");
  expect(result.repoOwner).toBe("Leonxlnx");
  expect(result.repoName).toBe("taste-skill");
  expect(result.repoUrl).toBe("https://github.com/Leonxlnx/taste-skill");
  expect(result.normalizedTags).toEqual([
    "taste-skill",
    "design-taste-frontend",
  ]);
  expect(result.styleCues).toEqual([
    "taste",
    "skill",
    "design",
    "frontend",
  ]);
});
