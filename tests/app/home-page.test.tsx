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

  expect(
    screen.getByRole("heading", {
      name: /product systems with working surfaces/i,
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

  expect(screen.getByText(/selected work/i)).toBeInTheDocument();
  expect(screen.getByText(/operating principles/i)).toBeInTheDocument();
  expect(
    screen.getByText(/run a component generation/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/generation inputs/i)).toBeInTheDocument();
  expect(
    screen.queryByText(/proof in the product surface/i),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/simple workflow/i)).not.toBeInTheDocument();
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
