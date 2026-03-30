import { requireUserSession } from "@/lib/auth/guards";

import { GenerationDetailClient } from "./generation-detail-client";

type GenerationDetailPageParams = Promise<{
  generationId: string;
}>;

export default async function GenerationDetailPage({
  params,
}: {
  params: GenerationDetailPageParams;
}) {
  const { generationId } = await params;

  await requireUserSession(`/history/${generationId}`);

  return <GenerationDetailClient generationId={generationId} />;
}
