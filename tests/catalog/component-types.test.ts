import { expect, test } from "vitest";
import { CORE_COMPONENT_TYPES } from "@/lib/catalog/component-types";

test("core component type list contains the approved 12 items", () => {
  expect(CORE_COMPONENT_TYPES).toHaveLength(12);
  expect(CORE_COMPONENT_TYPES).toContain("Button");
  expect(CORE_COMPONENT_TYPES).toContain("Navbar");
});
