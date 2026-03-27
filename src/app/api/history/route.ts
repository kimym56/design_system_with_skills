import {
  applyGuestCookie,
  resolveCurrentRequestActor,
} from "@/lib/auth/request-actor";
import { listGenerationsForActor } from "@/lib/generation/history-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const { actor, cookieToSet } = await resolveCurrentRequestActor();
  const generations = await listGenerationsForActor(actor);

  return applyGuestCookie(Response.json({ generations }), cookieToSet);
}
