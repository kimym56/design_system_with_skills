import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test } from "vitest";

test("globals.css does not include an unlayered button font shorthand reset", () => {
  const stylesheet = readFileSync(
    resolve(process.cwd(), "src/app/globals.css"),
    "utf8",
  );

  expect(stylesheet).not.toMatch(
    /button,\s*input,\s*select,\s*textarea\s*\{[^}]*font:\s*inherit;[^}]*\}/m,
  );
});
