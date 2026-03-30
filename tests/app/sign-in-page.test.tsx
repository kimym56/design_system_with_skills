import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import SignInPage from "@/app/sign-in/page";

const { signInMock } = vi.hoisted(() => ({
  signInMock: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  signIn: signInMock,
}));

beforeEach(() => {
  signInMock.mockReset();
  signInMock.mockResolvedValue(undefined);
});

test("sign-in page immediately starts Google auth with the requested callback URL", async () => {
  render(
    await SignInPage({
      searchParams: Promise.resolve({
        callbackUrl: "/history?view=grid",
      }),
    }),
  );

  expect(
    screen.getByRole("heading", { name: /redirecting to google/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/we're sending you to google sign-in now/i),
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(signInMock).toHaveBeenCalledWith("google", {
      callbackUrl: "/history?view=grid",
    });
  });
});

test("sign-in page keeps a manual retry button that reuses the callback URL", async () => {
  const user = userEvent.setup();

  render(
    await SignInPage({
      searchParams: Promise.resolve({
        callbackUrl: "/workspace",
      }),
    }),
  );

  await waitFor(() => {
    expect(signInMock).toHaveBeenCalledTimes(1);
  });

  await user.click(screen.getByRole("button", { name: /continue to google/i }));

  expect(signInMock).toHaveBeenCalledTimes(2);
  expect(signInMock).toHaveBeenLastCalledWith("google", {
    callbackUrl: "/workspace",
  });
});
