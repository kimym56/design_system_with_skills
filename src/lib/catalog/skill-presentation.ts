import { extractSkillOrderFromReadme } from "@/lib/catalog/readme-parser";

export type PresentableSkill = {
  id: string;
  name: string;
  repoName: string | null;
  sourceRepo: string | null;
  readmeContent: string | null;
  description: string | null;
  githubStars: number;
};

function resolveRepoGroupKey(skill: Pick<PresentableSkill, "sourceRepo" | "repoName">) {
  return skill.sourceRepo ?? skill.repoName ?? "";
}

function resolveRepoOrder(skill: Pick<PresentableSkill, "name" | "readmeContent">) {
  if (!skill.readmeContent) {
    return Number.POSITIVE_INFINITY;
  }

  const readmeOrder = extractSkillOrderFromReadme(skill.readmeContent);
  const index = readmeOrder.indexOf(skill.name.trim().toLowerCase());

  return index === -1 ? Number.POSITIVE_INFINITY : index;
}

export function buildSkillTitle({
  name,
  sourceRepo,
  repoName,
}: Pick<PresentableSkill, "name" | "sourceRepo" | "repoName">) {
  if (sourceRepo?.trim()) {
    return `${sourceRepo}/${name}`;
  }

  if (!repoName?.trim()) {
    return name;
  }

  return `${repoName}/${name}`;
}

export function sortPresentedSkills<T extends PresentableSkill>(skills: T[]) {
  return [...skills].sort((left, right) => {
    if (left.githubStars !== right.githubStars) {
      return right.githubStars - left.githubStars;
    }

    const leftRepoKey = resolveRepoGroupKey(left);
    const rightRepoKey = resolveRepoGroupKey(right);

    if (leftRepoKey !== rightRepoKey) {
      return left.name.localeCompare(right.name);
    }

    const leftRepoOrder = resolveRepoOrder(left);
    const rightRepoOrder = resolveRepoOrder(right);

    if (leftRepoOrder !== rightRepoOrder) {
      return leftRepoOrder - rightRepoOrder;
    }

    return left.name.localeCompare(right.name);
  });
}
