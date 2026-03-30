import { render, screen } from "@testing-library/react";
import { beforeEach, vi } from "vitest";

import HistoryPage from "@/app/(app)/(generation-history)/history/page";

const { requireUserSessionMock } = vi.hoisted(() => ({
  requireUserSessionMock: vi.fn(),
}));

vi.mock("@/lib/auth/guards", () => ({
  requireUserSession: requireUserSessionMock,
}));

beforeEach(() => {
  requireUserSessionMock.mockReset();
  requireUserSessionMock.mockResolvedValue({
    user: {
      id: "user-1",
      email: "ymkim@example.com",
      name: "Yongmin Kim",
      image: null,
    },
  });
});

test("history page shows a heading and empty-state copy", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        generations: [],
      })) as unknown as typeof fetch,
  );

  render(await HistoryPage());

  expect(requireUserSessionMock).toHaveBeenCalledWith("/history");

  expect(
    screen.getByRole("heading", { name: /saved runs/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /saved runs/i }).closest("main")?.className,
  ).toMatch(/px-4/);
  expect(
    await screen.findByText(/no runs yet/i),
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});
