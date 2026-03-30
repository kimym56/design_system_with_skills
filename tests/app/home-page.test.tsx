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
      name: /design system ui, tested in one workspace/i,
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /try DSSkills/i }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /try DSSkills/i }),
  ).not.toBeInTheDocument();

  const signInButton = screen.getByRole("button", {
    name: /sign in with google/i,
  });

  expect(signInButton).toBeInTheDocument();
  expect(screen.getByText(/generation workspace/i)).toBeInTheDocument();
  expect(screen.getByText(/saved runs history/i)).toBeInTheDocument();
  expect(screen.getByText(/custom \(tbd\)/i)).toBeInTheDocument();
  expect(
    screen.getByText(/© 2026 yongmin kim\. all rights reserved\./i),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
    "href",
    "mailto:kimym.svb@gmail.com",
  );
  expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
    "href",
    "https://github.com/kimym56/",
  );
  expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
    "href",
    "https://linkedin.com/in/kimym56",
  );
  expect(screen.getByRole("link", { name: /website/i })).toHaveAttribute(
    "href",
    "https://ymkim-portfolio.vercel.app",
  );
  expect(
    screen.queryByRole("heading", {
      name: /generate design system components with agent skills/i,
    }),
  ).not.toBeInTheDocument();

  await user.click(signInButton);

  expect(signInMock).toHaveBeenCalledWith("google", {
    callbackUrl: "/workspace",
  });
  expect(getServerAuthSessionMock).toHaveBeenCalledTimes(1);
});

test("homepage sends signed-in users straight to the workspace from Try DSSkills", async () => {
  getServerAuthSessionMock.mockResolvedValue({
    user: {
      id: "user-1",
      name: "Yongmin Kim",
      email: "ymkim@example.com",
      image: null,
    },
  });

  render(await Home());

  expect(screen.getByRole("link", { name: /try DSSkills/i })).toHaveAttribute(
    "href",
    "/workspace",
  );
  expect(
    screen.queryByRole("button", { name: /sign in with google/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /yongmin kim/i }),
  ).not.toBeInTheDocument();
  expect(getServerAuthSessionMock).toHaveBeenCalledTimes(1);
});
