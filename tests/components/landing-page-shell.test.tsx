import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";

import { LandingPageShell } from "@/components/landing-page-shell";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

const scrollIntoViewMock = vi.fn();

beforeEach(() => {
  scrollIntoViewMock.mockReset();
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scrollIntoViewMock,
  });
});

test("signed-out Try DSSkills scrolls to and focuses the main Google sign-in button", async () => {
  const user = userEvent.setup();

  render(<LandingPageShell isSignedIn={false} />);

  const root = screen.getByTestId("landing-page-root");
  const topBar = screen.getByTestId("landing-topbar");
  const trigger = screen.getByRole("button", { name: /try DSSkills/i });
  const signInButton = screen.getByRole("button", {
    name: /sign in with google/i,
  });

  expect(root).toHaveClass("landing-page-background");
  expect(topBar).toHaveClass("landing-page-background");
  expect(topBar).toHaveClass("rounded-none");
  expect(topBar).not.toHaveClass("border-b");
  expect(topBar).not.toHaveClass("bg-transparent");
  expect(topBar).not.toHaveClass("backdrop-blur");
  expect(topBar).not.toHaveClass("rounded-full");
  expect(trigger).not.toHaveClass("rounded-full");

  await user.click(trigger);

  expect(scrollIntoViewMock).toHaveBeenCalledWith({
    behavior: "smooth",
    block: "center",
  });
  expect(signInButton).toHaveFocus();
  expect(signInButton).toHaveAttribute("data-highlighted", "true");
});
