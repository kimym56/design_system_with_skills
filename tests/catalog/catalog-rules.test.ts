import { expect, test } from "vitest";

import {
  DEFAULT_RULES,
  qualifiesForAutoPublish,
} from "@/lib/catalog/catalog-rules";

test("only public ui/ux repositories with README and at least 1000 stars auto-publish", () => {
  expect(
    qualifiesForAutoPublish(
      {
        isPrivate: false,
        stars: 1200,
        topics: ["ui", "design-system"],
        hasReadme: true,
        readmeText: "A UI component skill for design systems",
      },
      DEFAULT_RULES,
    ),
  ).toBe(true);
});

test("repositories under the star floor do not auto-publish", () => {
  expect(
    qualifiesForAutoPublish(
      {
        isPrivate: false,
        stars: 300,
        topics: ["ui", "design-system"],
        hasReadme: true,
        readmeText: "A UI component skill for design systems",
      },
      DEFAULT_RULES,
    ),
  ).toBe(false);
});
