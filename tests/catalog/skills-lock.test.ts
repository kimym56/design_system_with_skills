import { expect, test } from "vitest";

import skillsLock from "../../skills-lock.json";

test("catalog lockfile includes the requested GitHub additions", () => {
  expect(skillsLock.skills["ui-ux-pro-max"]).toMatchObject({
    source: "nextlevelbuilder/ui-ux-pro-max-skill",
    sourceType: "github",
  });

  expect(skillsLock.skills.impeccable).toMatchObject({
    source: "pbakaus/impeccable",
    sourceType: "github",
  });
});

test("taste-skill aliases point to the upstream skill names", () => {
  expect(skillsLock.skills["taste-skill"]?.aliases).toContain("design-taste-frontend");
  expect(skillsLock.skills["output-skill"]?.aliases).toContain("full-output-enforcement");
  expect(skillsLock.skills["soft-skill"]?.aliases).toContain("high-end-visual-design");
  expect(skillsLock.skills["brutalist-skill"]?.aliases).toContain("industrial-brutalist-ui");
  expect(skillsLock.skills["minimalist-skill"]?.aliases).toContain("minimalist-ui");
  expect(skillsLock.skills["redesign-skill"]?.aliases).toContain("redesign-existing-projects");
  expect(skillsLock.skills["stitch-skill"]?.aliases).toContain("stitch-design-taste");
});
