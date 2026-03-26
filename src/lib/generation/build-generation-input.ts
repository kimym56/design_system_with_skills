import type { CoreComponentType } from "@/lib/catalog/component-types";

type SelectedSkill = {
  name: string;
  styleCues: string[];
  readmeSummary?: string | null;
};

type BuildGenerationInputArgs = {
  componentType: CoreComponentType;
  skills: SelectedSkill[];
};

export function buildGenerationInput({
  componentType,
  skills,
}: BuildGenerationInputArgs) {
  const styleCues = [...new Set(skills.flatMap((skill) => skill.styleCues))];

  return {
    componentType,
    selectedSkillNames: skills.map((skill) => skill.name),
    styleCues,
    summaries: skills
      .map((skill) => skill.readmeSummary?.trim())
      .filter((value): value is string => Boolean(value)),
  };
}
