import { handleGenerateRequest, createGenerateRequestDependencies } from "@/lib/generation/handle-generate-request";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  return handleGenerateRequest(body, createGenerateRequestDependencies());
}
