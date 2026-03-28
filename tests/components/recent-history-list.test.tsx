import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { RecentHistoryList } from "@/components/recent-history-list";

test("shows loading placeholders before recent history resolves", () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})) as unknown as typeof fetch,
  );

  render(<RecentHistoryList />);

  expect(
    screen.getByRole("status", { name: /loading recent runs/i }),
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("shows compact empty-state copy when there are no recent runs", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        generations: [],
      })) as unknown as typeof fetch,
  );

  render(<RecentHistoryList />);

  expect(
    await screen.findByText(/no recent runs yet/i),
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("shows inline error copy when recent history fails to load", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json(
        {
          error: "Sidebar history is unavailable.",
        },
        { status: 500 },
      )) as unknown as typeof fetch,
  );

  render(<RecentHistoryList />);

  expect(
    await screen.findByText(/sidebar history is unavailable/i),
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("shows only the five most recent runs and links to their detail pages", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        generations: [
          {
            id: "gen-1",
            componentType: "Input",
            createdAt: "2026-03-28T09:00:00.000Z",
            selectedSkills: [],
          },
          {
            id: "gen-2",
            componentType: "Button",
            createdAt: "2026-03-28T08:00:00.000Z",
            selectedSkills: [],
          },
          {
            id: "gen-3",
            componentType: "Card",
            createdAt: "2026-03-28T07:00:00.000Z",
            selectedSkills: [],
          },
          {
            id: "gen-4",
            componentType: "Tabs",
            createdAt: "2026-03-28T06:00:00.000Z",
            selectedSkills: [],
          },
          {
            id: "gen-5",
            componentType: "Modal",
            createdAt: "2026-03-28T05:00:00.000Z",
            selectedSkills: [],
          },
          {
            id: "gen-6",
            componentType: "Textarea",
            createdAt: "2026-03-28T04:00:00.000Z",
            selectedSkills: [],
          },
        ],
      })) as unknown as typeof fetch,
  );

  render(<RecentHistoryList />);

  await waitFor(() => {
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  expect(screen.getByRole("link", { name: /input/i })).toHaveAttribute(
    "href",
    "/history/gen-1",
  );
  expect(screen.getByRole("link", { name: /modal/i })).toHaveAttribute(
    "href",
    "/history/gen-5",
  );
  expect(
    screen.queryByRole("link", { name: /textarea/i }),
  ).not.toBeInTheDocument();

  vi.unstubAllGlobals();
});
