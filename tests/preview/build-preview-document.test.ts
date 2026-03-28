import { expect, test } from "vitest";

import { buildPreviewDocument } from "@/lib/preview/build-preview-document";

test("preview document avoids forced viewport-height overflow for inline previews", () => {
  const documentHtml = buildPreviewDocument("<button>Demo</button>");

  expect(documentHtml).toContain("height: 100%");
  expect(documentHtml).toContain("box-sizing: border-box");
  expect(documentHtml).not.toContain("min-height: 100vh");
});

test("preview document wraps generated markup in a centered stage", () => {
  const documentHtml = buildPreviewDocument("<button>Demo</button>");

  expect(documentHtml).toContain('class="preview-content"');
  expect(documentHtml).toContain("justify-items: center");
  expect(documentHtml).toContain("align-content: center");
});
