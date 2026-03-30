import { beforeEach, expect, test, vi } from "vitest";

const { getServerAuthSessionMock, redirectMock } = vi.hoisted(() => ({
  getServerAuthSessionMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("@/auth", () => ({
  getServerAuthSession: getServerAuthSessionMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import { requireUserSession } from "@/lib/auth/guards";

beforeEach(() => {
  getServerAuthSessionMock.mockReset();
  redirectMock.mockReset();
  redirectMock.mockImplementation((destination: string) => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  });
});

test("requireUserSession redirects signed-out users to /sign-in with the original destination", async () => {
  getServerAuthSessionMock.mockResolvedValue(null);

  await expect(
    requireUserSession("/history?view=grid&tab=recent"),
  ).rejects.toThrow(
    "NEXT_REDIRECT:/sign-in?callbackUrl=%2Fhistory%3Fview%3Dgrid%26tab%3Drecent",
  );

  expect(getServerAuthSessionMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith(
    "/sign-in?callbackUrl=%2Fhistory%3Fview%3Dgrid%26tab%3Drecent",
  );
});

test("requireUserSession returns the session for signed-in users", async () => {
  const session = {
    user: {
      id: "user-1",
      email: "ymkim@example.com",
      name: "Yongmin Kim",
      image: null,
    },
  };
  getServerAuthSessionMock.mockResolvedValue(session);

  await expect(requireUserSession("/workspace")).resolves.toEqual(session);

  expect(getServerAuthSessionMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).not.toHaveBeenCalled();
});
