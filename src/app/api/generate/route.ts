import { handleGenerateRequest, createGenerateRequestDependencies } from "@/lib/generation/handle-generate-request";

export async function POST(request: Request) {
  const body = await request.json();
  return handleGenerateRequest(body, createGenerateRequestDependencies());
}
