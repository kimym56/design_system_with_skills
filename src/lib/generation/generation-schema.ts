import { z } from "zod";

export const generatedComponentSchema = z.object({
  componentName: z.string().min(1),
  code: z.string().min(1),
  previewMarkup: z.string().min(1),
  rationale: z.string().min(1),
});

export type GeneratedComponent = z.infer<typeof generatedComponentSchema>;
