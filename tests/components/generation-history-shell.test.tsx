import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

let pathname = "/workspace";
let isDesktop = false;

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

vi.mock("@/components/recent-history-list", () => ({
  RecentHistoryList: () => <div>Mock recent history</div>,
}));

import { GenerationHistoryShell } from "@/components/generation-history-shell";

function installMatchMediaMock() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: query === "(min-width: 1280px)" ? isDesktop : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeEach(() => {
  pathname = "/workspace";
  isDesktop = false;
  installMatchMediaMock();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("opens by default on desktop and can be collapsed and reopened", async () => {
  isDesktop = true;
  installMatchMediaMock();

  render(
    <GenerationHistoryShell>
      <div>child</div>
    </GenerationHistoryShell>,
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /close navigation menu/i }),
    ).toBeInTheDocument();
  });

  expect(screen.getByTestId("generation-history-shell")).toHaveClass("w-full");
  expect(screen.getByTestId("generation-history-shell")).not.toHaveClass(
    "mx-auto",
  );
  expect(screen.getByTestId("generation-history-content")).not.toHaveClass("px-4");
  expect(screen.getByTestId("generation-history-content")).not.toHaveClass("py-4");
  expect(screen.getByRole("complementary")).toHaveClass("border-r");
  expect(screen.getByRole("link", { name: /new run/i })).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /close navigation menu/i }),
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /open navigation menu/i }),
    ).toBeInTheDocument();
  });

  expect(
    screen.queryByRole("link", { name: /new run/i }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));

  await waitFor(() => {
    expect(screen.getByRole("link", { name: /new run/i })).toBeInTheDocument();
  });
});

test("starts closed on smaller screens", () => {
  render(
    <GenerationHistoryShell>
      <div>child</div>
    </GenerationHistoryShell>,
  );

  expect(
    screen.getByRole("button", { name: /open navigation menu/i }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /new run/i }),
  ).not.toBeInTheDocument();
  expect(screen.getByTestId("generation-history-content")).not.toHaveClass("px-4");
  expect(screen.getByTestId("generation-history-content")).not.toHaveClass("py-4");
  expect(screen.getByText("child")).toBeInTheDocument();
});

test("shows a compact account trigger instead of the generation history label when user info is available", () => {
  render(
    <GenerationHistoryShell
      accountUser={{
        name: "Yongmin Kim",
        email: "ymkim@example.com",
        image: null,
      }}
    >
      <div>child</div>
    </GenerationHistoryShell>,
  );

  expect(screen.getByRole("button", { name: /yongmin/i })).toBeInTheDocument();
  expect(screen.queryByText(/generation history/i)).not.toBeInTheDocument();
});

test("closes the mobile overlay drawer on backdrop click", async () => {
  render(
    <GenerationHistoryShell>
      <div>child</div>
    </GenerationHistoryShell>,
  );

  fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /new run/i })).toBeInTheDocument();

  fireEvent.click(screen.getByTestId("drawer-backdrop"));

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

test("closes the mobile overlay drawer on escape", async () => {
  render(
    <GenerationHistoryShell>
      <div>child</div>
    </GenerationHistoryShell>,
  );

  fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  fireEvent.keyDown(window, { key: "Escape" });

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

test("closes the mobile overlay drawer after route changes", async () => {
  const { rerender } = render(
    <GenerationHistoryShell>
      <div>child</div>
    </GenerationHistoryShell>,
  );

  fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  pathname = "/history";

  rerender(
    <GenerationHistoryShell>
      <div>child</div>
    </GenerationHistoryShell>,
  );

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
