import {
  applyGuestCookie,
  resolveCurrentRequestActor,
} from "@/lib/auth/request-actor";
import {
  buildSkillTitle,
  sortPresentedSkills,
} from "@/lib/catalog/skill-presentation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { actor, cookieToSet } = await resolveCurrentRequestActor();

  const skills = await db.skill.findMany({
    where: {
      publishStatus: "PUBLISHED",
    },
    select: {
      id: true,
      name: true,
      description: true,
      githubStars: true,
      repoName: true,
      sourceRepo: true,
      readmeContent: true,
    },
  });

  const presentedSkills = sortPresentedSkills(skills).map((skill) => ({
    id: skill.id,
    name: skill.name,
    title: buildSkillTitle(skill),
    description: skill.description,
    githubStars: skill.githubStars,
  }));

  return applyGuestCookie(
    Response.json({
      skills: presentedSkills,
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
