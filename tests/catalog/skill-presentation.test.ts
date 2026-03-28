import { expect, test } from "vitest";

import {
  buildSkillTitle,
  sortPresentedSkills,
} from "@/lib/catalog/skill-presentation";

test("builds a display title with source repo before skill name", () => {
  expect(
    buildSkillTitle({
      name: "redesign-skill",
      sourceRepo: "Leonxlnx/taste-skill",
      repoName: "taste-skill",
    }),
  ).toBe("Leonxlnx/taste-skill/redesign-skill");
});

test("sorts skills from the same repo by README skill order", () => {
  const sorted = sortPresentedSkills([
    {
      id: "skill-3",
      name: "stitch-skill",
      repoName: "taste-skill",
      sourceRepo: "Leonxlnx/taste-skill",
      readmeContent: [
        "| Skill | Description |",
        "| --- | --- |",
        "| **taste-skill** | Main skill |",
        "| **redesign-skill** | Redesign skill |",
        "| **stitch-skill** | Stitch skill |",
      ].join("\n"),
      description: "Stitch skill",
      githubStars: 6061,
    },
    {
      id: "skill-2",
      name: "redesign-skill",
      repoName: "taste-skill",
      sourceRepo: "Leonxlnx/taste-skill",
      readmeContent: [
        "| Skill | Description |",
        "| --- | --- |",
        "| **taste-skill** | Main skill |",
        "| **redesign-skill** | Redesign skill |",
        "| **stitch-skill** | Stitch skill |",
      ].join("\n"),
      description: "Redesign skill",
      githubStars: 6061,
    },
    {
      id: "skill-1",
      name: "taste-skill",
      repoName: "taste-skill",
      sourceRepo: "Leonxlnx/taste-skill",
      readmeContent: [
        "| Skill | Description |",
        "| --- | --- |",
        "| **taste-skill** | Main skill |",
        "| **redesign-skill** | Redesign skill |",
        "| **stitch-skill** | Stitch skill |",
      ].join("\n"),
      description: "Main skill",
      githubStars: 6061,
    },
  ]);

  expect(sorted.map((skill) => skill.name)).toEqual([
    "taste-skill",
    "redesign-skill",
    "stitch-skill",
  ]);
});
