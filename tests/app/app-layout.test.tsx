import { render, screen } from "@testing-library/react";
import { beforeEach, vi } from "vitest";

import AppLayout from "@/app/(app)/(generation-history)/layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/workspace",
}));

vi.mock("@/components/recent-history-list", () => ({
  RecentHistoryList: () => <div>Mock recent history</div>,
}));

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn(() => ({
      matches: true,
      media: "(min-width: 1280px)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

test("generation-history layout renders the shared left rail", () => {
  render(
    <AppLayout>
      <div>child</div>
    </AppLayout>,
  );

  expect(
    screen.getByRole("button", { name: /close navigation menu/i }),
  ).toBeInTheDocument();
  expect(screen.getByTestId("generation-history-shell")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /new run/i })).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /view all history/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/recent runs/i)).toBeInTheDocument();
  expect(screen.getByText(/mock recent history/i)).toBeInTheDocument();
  expect(screen.getByText("child")).toBeInTheDocument();
  expect(screen.getByTestId("generation-history-content")).not.toHaveClass(
    "rounded-[16px]",
  );
  expect(screen.queryByText(/open access/i)).not.toBeInTheDocument();
  expect(
    screen.queryByText(/generate from approved skills/i),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(/safe runtime\. approved inputs\. saved runs\./i),
  ).not.toBeInTheDocument();
});
