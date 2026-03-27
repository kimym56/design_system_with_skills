import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import HistoryPage from "@/app/(app)/history/page";

test("history page shows a heading and empty-state copy", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        generations: [],
      })) as unknown as typeof fetch,
  );

  render(<HistoryPage />);

  expect(
    screen.getByRole("heading", { name: /saved runs/i }),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/no runs yet/i),
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});
