import { expect, test } from "vitest";

import { buildGenerationOwnerFilter } from "@/lib/generation/history-service";

test("guest filters target the guest id", () => {
  expect(
    buildGenerationOwnerFilter({
      type: "guest",
      guestId: "guest_123",
      isNewGuest: false,
    }),
  ).toEqual({ guestId: "guest_123" });
});

test("user filters target the user id", () => {
  expect(
    buildGenerationOwnerFilter({
      type: "user",
      userId: "user_123",
    }),
  ).toEqual({ userId: "user_123" });
});
