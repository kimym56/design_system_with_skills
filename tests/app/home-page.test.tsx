import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Home from "@/app/page";

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

test("homepage shows the product headline and sends explicit sign-in clicks directly to Google", async () => {
  const user = userEvent.setup();

  render(<Home />);

  expect(
    screen.getByRole("heading", {
      name: /generate design system components from selected ui skills/i,
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

  expect(screen.getByText(/open access is live right now/i)).toBeInTheDocument();

  expect(screen.getByText(/simple workflow/i)).toBeInTheDocument();
});
