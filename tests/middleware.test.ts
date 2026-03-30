import { NextRequest } from "next/server";

import { middleware } from "../middleware";

test("public routes continue without checking auth", async () => {
  const response = await middleware(new NextRequest("https://example.com/"));

  expect(response.headers.get("location")).toBeNull();
});

test("protected routes continue because auth is enforced by server-rendered pages", async () => {
  const response = await middleware(
    new NextRequest("https://example.com/history?view=grid&tab=recent"),
  );

  expect(response.headers.get("location")).toBeNull();
});
