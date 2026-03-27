import {
  applyGuestCookie,
  resolveCurrentRequestActor,
} from "@/lib/auth/request-actor";
import { getGenerationForActor } from "@/lib/generation/history-service";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{
    generationId: string;
  }>;
};

export async function GET(_: Request, context: Context) {
  const { actor, cookieToSet } = await resolveCurrentRequestActor();
  const { generationId } = await context.params;
  const generation = await getGenerationForActor(generationId, actor);

  if (!generation) {
    return applyGuestCookie(
      Response.json({ error: "Generation not found." }, { status: 404 }),
      cookieToSet,
    );
  }

  return applyGuestCookie(Response.json({ generation }), cookieToSet);
}
