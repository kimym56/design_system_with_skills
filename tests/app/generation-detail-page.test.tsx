import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import GenerationDetailPage from "@/app/(app)/history/[generationId]/page";

vi.mock("next/navigation", () => ({
  useParams: () => ({ generationId: "demo-generation" }),
}));

test("generation detail page shows editorial loading copy before data arrives", () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})) as unknown as typeof fetch,
  );

  render(<GenerationDetailPage />);

  expect(screen.getByText(/loading saved result/i)).toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("generation detail page shows the saved run summary", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        generation: {
          id: "demo-generation",
          componentType: "Button",
          rationale: "Approved skills favored a compact primary action.",
          resultCode: "export function Demo() { return <button />; }",
          createdAt: "2026-03-27T10:00:00.000Z",
          model: "gpt-5.4",
          previewPayload: {
            html: "<button>Demo</button>",
          },
          selectedSkills: [
            {
              skill: {
                id: "s1",
                name: "minimalist-ui",
              },
            },
          ],
        },
      })) as unknown as typeof fetch,
  );

  render(<GenerationDetailPage />);

  expect(
    await screen.findByRole("heading", { name: /button/i }),
  ).toBeInTheDocument();
  expect(await screen.findByText(/saved run summary/i)).toBeInTheDocument();

  vi.unstubAllGlobals();
});
