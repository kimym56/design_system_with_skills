import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import WorkspacePage from "@/app/(app)/workspace/page";

test("workspace page shows the generation builder heading", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        skills: [
          {
            id: "skill-1",
            name: "minimalist-ui",
            description: "Minimal interface treatment",
            githubStars: 120,
          },
        ],
        quota: {
          remaining: 5,
          usedToday: 0,
          limit: 5,
        },
      })) as unknown as typeof fetch,
  );

  render(<WorkspacePage />);

  expect(
    screen.getByRole("heading", { name: /run a component generation/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/review the rendered preview and source before you save the run/i),
  ).toBeInTheDocument();

  expect(await screen.findByText(/minimalist-ui/i)).toBeInTheDocument();

  vi.unstubAllGlobals();
});
