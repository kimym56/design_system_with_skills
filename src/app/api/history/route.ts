import { getServerAuthSession } from "@/auth";
import { listGenerationsForUser } from "@/lib/generation/history-service";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const generations = await listGenerationsForUser(session.user.id);

  return Response.json({ generations });
}
