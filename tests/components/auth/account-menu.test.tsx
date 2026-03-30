import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { AccountMenu } from "@/components/auth/account-menu";

const { signOutMock } = vi.hoisted(() => ({
  signOutMock: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  signOut: signOutMock,
}));

beforeEach(() => {
  signOutMock.mockReset();
  signOutMock.mockResolvedValue(undefined);
});

test("renders initials, opens the menu, and exposes account actions", async () => {
  const user = userEvent.setup();

  render(
    <AccountMenu
      user={{
        name: "Yongmin Kim",
        email: "ymkim@example.com",
        image: null,
      }}
      variant="homepage"
    />,
  );

  const homepageTrigger = screen.getByRole("button", {
    name: /yongmin kim/i,
  });

  expect(screen.getByText("YK")).toBeInTheDocument();
  expect(homepageTrigger).toHaveClass("rounded-[14px]");
  expect(homepageTrigger).not.toHaveClass("rounded-full");

  await user.click(homepageTrigger);

  expect(screen.getByTestId("account-menu-panel")).toHaveClass("rounded-[16px]");

  expect(screen.getByText(/ymkim@example.com/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /workspace/i })).toHaveAttribute(
    "href",
    "/workspace",
  );
  expect(screen.getByRole("link", { name: /history/i })).toHaveAttribute(
    "href",
    "/history",
  );

  await user.click(screen.getByRole("button", { name: /sign out/i }));

  expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/" });
});

test("closes the menu on outside click and escape", async () => {
  const user = userEvent.setup();

  render(
    <AccountMenu
      user={{
        name: "Yongmin Kim",
        email: "ymkim@example.com",
        image: null,
      }}
      variant="compact"
    />,
  );

  const compactTrigger = screen.getByRole("button", { name: /yongmin/i });

  expect(compactTrigger).toHaveClass("rounded-[12px]");
  expect(compactTrigger).not.toHaveClass("rounded-full");

  await user.click(compactTrigger);
  expect(screen.getByText(/ymkim@example.com/i)).toBeInTheDocument();

  fireEvent.mouseDown(document.body);
  expect(screen.queryByText(/ymkim@example.com/i)).not.toBeInTheDocument();

  await user.click(compactTrigger);
  expect(screen.getByText(/ymkim@example.com/i)).toBeInTheDocument();

  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByText(/ymkim@example.com/i)).not.toBeInTheDocument();
});
