import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import WorkspacePage from "@/app/(app)/workspace/page";

test("workspace page shows the generation builder heading", async () => {
  const user = userEvent.setup();

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
    screen.getByText(
      /select a component, choose approved skills, and review the output before saving the run/i,
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /generation inputs/i }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/approved catalog/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/curated inputs only/i)).not.toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: /component type/i })).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /select skills/i }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/minimalist-ui/i)).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /select skills/i }));

  expect(await screen.findByText(/minimalist-ui/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /preview/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /generated code/i }),
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});
