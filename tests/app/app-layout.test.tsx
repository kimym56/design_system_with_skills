import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import AppLayout from "@/app/(app)/(generation-history)/layout";

vi.mock("@/components/recent-history-list", () => ({
  RecentHistoryList: () => <div>Mock recent history</div>,
}));

test("generation-history layout renders the shared left rail", () => {
  render(
    <AppLayout>
      <div>child</div>
    </AppLayout>,
  );

  expect(screen.getByRole("link", { name: /new run/i })).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /view all history/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/recent runs/i)).toBeInTheDocument();
  expect(screen.getByText(/mock recent history/i)).toBeInTheDocument();
  expect(screen.queryByText(/open access/i)).not.toBeInTheDocument();
  expect(
    screen.queryByText(/generate from approved skills/i),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(/safe runtime\. approved inputs\. saved runs\./i),
  ).not.toBeInTheDocument();
});
