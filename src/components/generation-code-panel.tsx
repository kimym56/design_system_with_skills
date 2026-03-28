"use client";

import { GeneratedCodeViewer } from "@/components/generated-code-viewer";

export function GenerationCodePanel({
  code,
  size = "inline",
}: {
  code: string | null;
  size?: "inline" | "dialog";
}) {
  return <GeneratedCodeViewer code={code} size={size} />;
}
