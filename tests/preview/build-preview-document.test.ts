import { expect, test } from "vitest";

import { buildPreviewDocument } from "@/lib/preview/build-preview-document";

test("preview document avoids forced viewport-height overflow for inline previews", () => {
  const documentHtml = buildPreviewDocument("<button>Demo</button>");

  expect(documentHtml).toContain("height: 100%");
  expect(documentHtml).toContain("box-sizing: border-box");
  expect(documentHtml).not.toContain("min-height: 100vh");
});
