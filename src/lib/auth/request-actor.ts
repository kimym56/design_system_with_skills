import { randomUUID } from "node:crypto";

export const GUEST_ID_COOKIE_NAME = "design_system_guest";
const GUEST_ID_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type SessionShape = {
  user?: {
    id?: string;
  };
} | null;

export type RequestActor =
  | {
      type: "user";
      userId: string;
    }
  | {
      type: "guest";
      guestId: string;
      isNewGuest: boolean;
    };

export async function resolveRequestActor({
  session,
  guestCookieValue,
}: {
  session: SessionShape;
  guestCookieValue?: string;
}): Promise<{
  actor: RequestActor;
  cookieToSet: string | null;
}> {
  const userId = session?.user?.id;

  if (userId) {
    return {
      actor: {
        type: "user",
        userId,
      },
      cookieToSet: null,
    };
  }

  if (guestCookieValue) {
    return {
      actor: {
        type: "guest",
        guestId: guestCookieValue,
        isNewGuest: false,
      },
      cookieToSet: null,
    };
  }

  const guestId = randomUUID();

  return {
    actor: {
      type: "guest",
      guestId,
      isNewGuest: true,
    },
    cookieToSet: guestId,
  };
}

export function buildGuestIdCookie(guestId: string) {
  return [
    `${GUEST_ID_COOKIE_NAME}=${encodeURIComponent(guestId)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${GUEST_ID_COOKIE_MAX_AGE}`,
  ].join("; ");
}

export function applyGuestCookie(response: Response, cookieToSet: string | null) {
  if (cookieToSet) {
    response.headers.set("Set-Cookie", buildGuestIdCookie(cookieToSet));
  }

  return response;
}

export async function resolveCurrentRequestActor() {
  const { getServerAuthSession } = await import("@/auth");
  const { cookies } = await import("next/headers");

  const cookieStore = await cookies();
  const session = (await getServerAuthSession()) as SessionShape;

  return resolveRequestActor({
    session,
    guestCookieValue: cookieStore.get(GUEST_ID_COOKIE_NAME)?.value,
  });
}
