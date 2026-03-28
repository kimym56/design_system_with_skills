import { render, screen } from "@testing-library/react";
import { afterEach, vi } from "vitest";

let pathname = "/workspace";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

vi.mock("@/components/recent-history-list", () => ({
  RecentHistoryList: () => <div>Mock recent history</div>,
}));

import { AppSidebar } from "@/components/app-sidebar";

afterEach(() => {
  pathname = "/workspace";
});

test("shows the focused workspace rail on the generation page", () => {
  pathname = "/workspace";

  render(<AppSidebar />);

  expect(screen.getByText(/design system ai/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /new run/i })).toHaveAttribute(
    "href",
    "/workspace",
  );
  expect(screen.getByRole("link", { name: /new run/i })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    screen.getByRole("link", { name: /view all history/i }),
  ).toHaveAttribute("href", "/history");
  expect(screen.getByText(/recent runs/i)).toBeInTheDocument();
  expect(screen.getByText(/mock recent history/i)).toBeInTheDocument();
});

test("keeps the same rich rail on the history index route", () => {
  pathname = "/history";

  render(<AppSidebar />);

  expect(screen.getByRole("link", { name: /new run/i })).toHaveAttribute(
    "href",
    "/workspace",
  );
  expect(
    screen.getByRole("link", { name: /view all history/i }),
  ).toHaveAttribute("aria-current", "page");
  expect(screen.getByText(/recent runs/i)).toBeInTheDocument();
  expect(screen.getByText(/mock recent history/i)).toBeInTheDocument();
});

test("keeps the same rich rail on saved-run detail routes", () => {
  pathname = "/history/demo-generation";

  render(<AppSidebar />);

  expect(screen.getByRole("link", { name: /new run/i })).toHaveAttribute(
    "href",
    "/workspace",
  );
  expect(
    screen.getByRole("link", { name: /view all history/i }),
  ).toHaveAttribute("href", "/history");
  expect(
    screen.getByRole("link", { name: /view all history/i }),
  ).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByText(/recent runs/i)).toBeInTheDocument();
  expect(screen.getByText(/mock recent history/i)).toBeInTheDocument();
});
