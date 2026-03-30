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

test("hero layout does not force the workspace frame to a fixed minimum width", () => {
  render(<LandingPageShell isSignedIn={false} />);

  const heroSection = screen
    .getByRole("heading", {
      name: /design system ui, tested in one workspace\./i,
    })
    .closest("section");

  expect(heroSection).toHaveClass(
    "lg:grid-cols-[minmax(0,0.84fr)_minmax(0,0.96fr)]",
  );
  expect(heroSection).not.toHaveClass(
    "lg:grid-cols-[minmax(0,0.84fr)_minmax(460px,0.96fr)]",
  );
});

test("generated code panel includes helper copy under its heading", () => {
  render(<LandingPageShell isSignedIn={false} />);

  expect(
    screen.getByText(/review the exact code returned for this component run\./i),
  ).toBeInTheDocument();
});

test("preview header keeps helper copy on a second line and gives preview more width", () => {
  const { container } = render(<LandingPageShell isSignedIn={false} />);

  const previewGrid = container.querySelector(
    ".xl\\:grid-cols-\\[1\\.08fr_0\\.92fr\\]",
  );
  const previewCopy = screen.getByText(
    /rendered output inside the isolated preview runtime\./i,
  );
  const previewHeader = previewCopy.closest("div");

  expect(previewGrid).toHaveClass("xl:grid-cols-[1.08fr_0.92fr]");
  expect(previewHeader).not.toHaveClass("xl:flex");
  expect(previewCopy).toHaveClass("whitespace-nowrap");
});
