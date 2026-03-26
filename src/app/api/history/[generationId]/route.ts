import { getServerAuthSession } from "@/auth";
import { getGenerationForUser } from "@/lib/generation/history-service";

type Context = {
  params: Promise<{
    generationId: string;
  }>;
};

export async function GET(_: Request, context: Context) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { generationId } = await context.params;
  const generation = await getGenerationForUser(generationId, session.user.id);

  if (!generation) {
    return Response.json({ error: "Generation not found." }, { status: 404 });
  }

  return Response.json({ generation });
}
