import {
  applyGuestCookie,
  resolveCurrentRequestActor,
} from "@/lib/auth/request-actor";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { actor, cookieToSet } = await resolveCurrentRequestActor();

  const skills = await db.skill.findMany({
    where: {
      publishStatus: "PUBLISHED",
    },
    orderBy: [{ githubStars: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      description: true,
      githubStars: true,
    },
  });

  return applyGuestCookie(
    Response.json({
      skills,
      quota: {
        allowed: true,
        remaining: null,
        limit: null,
        usedToday: 0,
        actorId: actor.type === "user" ? actor.userId : actor.guestId,
        isUnlimited: true,
      },
    }),
    cookieToSet,
  );
}
