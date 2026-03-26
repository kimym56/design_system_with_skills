import { getServerAuthSession } from "@/auth";
import { db } from "@/lib/db";
import { getUserQuotaStatus } from "@/lib/generation/quota-service";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const [skills, quota] = await Promise.all([
    db.skill.findMany({
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
    }),
    getUserQuotaStatus(db, session.user.id),
  ]);

  return Response.json({ skills, quota });
}
