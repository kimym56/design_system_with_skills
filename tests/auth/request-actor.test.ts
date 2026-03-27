import { expect, test } from "vitest";

import { resolveRequestActor } from "@/lib/auth/request-actor";

test("signed-in sessions win over guest cookies", async () => {
  const result = await resolveRequestActor({
    session: { user: { id: "user_123" } },
    guestCookieValue: "guest_existing",
  });

  expect(result.actor).toEqual({ type: "user", userId: "user_123" });
  expect(result.cookieToSet).toBeNull();
});

test("anonymous requests reuse an existing guest cookie", async () => {
  const result = await resolveRequestActor({
    session: null,
    guestCookieValue: "guest_existing",
  });

  expect(result.actor).toEqual({
    type: "guest",
    guestId: "guest_existing",
    isNewGuest: false,
  });
  expect(result.cookieToSet).toBeNull();
});

test("anonymous requests get a new guest id when none exists", async () => {
  const result = await resolveRequestActor({
    session: null,
    guestCookieValue: undefined,
  });

  expect(result.actor.type).toBe("guest");

  if (result.actor.type !== "guest") {
    throw new Error("expected a guest actor");
  }

  expect(result.actor.guestId).toBeTruthy();
  expect(result.actor.isNewGuest).toBe(true);
  expect(result.cookieToSet).toBe(result.actor.guestId);
});
