import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Home from "@/app/page";

const { getServerAuthSessionMock, signInMock } = vi.hoisted(() => ({
  getServerAuthSessionMock: vi.fn(),
  signInMock: vi.fn(),
}));

vi.mock("@/auth", () => ({
  getServerAuthSession: getServerAuthSessionMock,
}));

vi.mock("next-auth/react", () => ({
  signIn: signInMock,
}));

beforeEach(() => {
  getServerAuthSessionMock.mockReset();
  getServerAuthSessionMock.mockResolvedValue(null);
  signInMock.mockReset();
  signInMock.mockResolvedValue(undefined);
});

test("homepage shows signed-out users explicit Google sign-in buttons", async () => {
  const user = userEvent.setup();

  render(await Home());

  expect(screen.queryAllByText(/portfolio/i)).toHaveLength(0);
  expect(
    screen.getByRole("heading", {
      name: /generate design system components with agent skills/i,
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: /open workspace/i }),
  ).toHaveAttribute("href", "/workspace");

  const signInButtons = screen.getAllByRole("button", {
    name: /sign in with google/i,
  });

  expect(signInButtons).toHaveLength(2);
  expect(
    screen.queryByRole("link", { name: /sign in with google/i }),
  ).not.toBeInTheDocument();

  await user.click(signInButtons[0]);
  await user.click(signInButtons[1]);

  expect(signInMock).toHaveBeenNthCalledWith(1, "google", {
    callbackUrl: "/workspace",
  });
  expect(signInMock).toHaveBeenNthCalledWith(2, "google", {
    callbackUrl: "/workspace",
  });
  expect(getServerAuthSessionMock).toHaveBeenCalledTimes(1);

  expect(screen.getByText(/evaluation surfaces/i)).toBeInTheDocument();
  expect(screen.getByText(/review rules/i)).toBeInTheDocument();
  expect(
    screen.getByText(/generate a component run/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/generation inputs/i)).toBeInTheDocument();
  const evidenceCards = screen.getAllByTestId("landing-evidence-card");
  expect(evidenceCards).toHaveLength(3);
  evidenceCards.forEach((card) => {
    expect(card).toHaveClass("space-y-1.5");
    expect(card).toHaveClass("px-3.5");
    expect(card).toHaveClass("py-3");
    expect(card).toHaveClass("sm:px-3.5");
    expect(card).toHaveClass("sm:py-3");
  });
  expect(
    screen.queryByText(/design engineer/i),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/selected work/i)).not.toBeInTheDocument();
});

test("homepage shows signed-in users an account chip instead of Google sign-in buttons", async () => {
  getServerAuthSessionMock.mockResolvedValue({
    user: {
      id: "user-1",
      name: "Yongmin Kim",
      email: "ymkim@example.com",
      image: null,
    },
  });

  render(await Home());

  expect(
    screen.getByRole("button", { name: /yongmin kim/i }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /sign in with google/i }),
  ).not.toBeInTheDocument();
  expect(getServerAuthSessionMock).toHaveBeenCalledTimes(1);
});
