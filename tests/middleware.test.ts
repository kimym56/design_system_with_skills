import { NextRequest } from "next/server";
import { vi } from "vitest";

import { middleware } from "../middleware";

const { getTokenMock } = vi.hoisted(() => ({
  getTokenMock: vi.fn(),
}));

vi.mock("next-auth/jwt", () => ({
  getToken: getTokenMock,
}));

const originalAuthSecret = process.env.AUTH_SECRET;

beforeEach(() => {
  getTokenMock.mockReset();
  process.env.AUTH_SECRET = "test-auth-secret";
});

afterAll(() => {
  if (originalAuthSecret === undefined) {
    delete process.env.AUTH_SECRET;
    return;
  }

  process.env.AUTH_SECRET = originalAuthSecret;
});

test("public routes continue without checking auth", async () => {
  const response = await middleware(new NextRequest("https://example.com/"));

  expect(response.headers.get("location")).toBeNull();
  expect(getTokenMock).not.toHaveBeenCalled();
});

test("protected routes redirect unauthenticated users to /sign-in with the original destination", async () => {
  getTokenMock.mockResolvedValue(null);

  const response = await middleware(
    new NextRequest("https://example.com/history?view=grid&tab=recent"),
  );

  const location = response.headers.get("location");

  expect(location).not.toBeNull();
  const redirectUrl = new URL(location!);

  expect(redirectUrl.pathname).toBe("/sign-in");
  expect(redirectUrl.searchParams.get("callbackUrl")).toBe(
    "/history?view=grid&tab=recent",
  );
  expect(getTokenMock).toHaveBeenCalledWith({
    req: expect.any(NextRequest),
    secret: "test-auth-secret",
  });
});

test("protected routes continue when a token exists", async () => {
  getTokenMock.mockResolvedValue({ sub: "user-1" });

  const response = await middleware(
    new NextRequest("https://example.com/workspace"),
  );

  expect(response.headers.get("location")).toBeNull();
  expect(getTokenMock).toHaveBeenCalledWith({
    req: expect.any(NextRequest),
    secret: "test-auth-secret",
  });
});
