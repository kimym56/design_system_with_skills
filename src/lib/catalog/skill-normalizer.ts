import { SkillPublishStatus, SkillSourceType } from "@prisma/client";

import { summarizeReadme } from "@/lib/catalog/readme-parser";

export type NormalizedSkillInput = {
  fullName: string;
  description?: string | null;
  stars: number;
  topics: string[];
  readmeText: string;
  computedHash?: string | null;
  sourceType?: SkillSourceType;
  publishStatus?: SkillPublishStatus;
};

export function normalizeSkill({
  fullName,
  description,
  stars,
  topics,
  readmeText,
  computedHash,
  sourceType = SkillSourceType.GITHUB_DISCOVERED,
  publishStatus = SkillPublishStatus.PUBLISHED,
}: NormalizedSkillInput) {
  const [repoOwner, repoName] = fullName.split("/");
  const slug = fullName.replace("/", "-").toLowerCase();

  return {
    name: repoName,
    slug,
    sourceType,
    publishStatus,
    sourceRepo: fullName,
    repoUrl: `https://github.com/${fullName}`,
    repoOwner,
    repoName,
    description: description ?? summarizeReadme(readmeText, 120),
    githubStars: stars,
    topics: topics.map((topic) => topic.toLowerCase()),
    normalizedTags: topics.map((topic) => topic.toLowerCase()),
    styleCues: topics.map((topic) => topic.toLowerCase()),
    readmeSummary: summarizeReadme(readmeText),
    readmeContent: readmeText,
    computedHash: computedHash ?? null,
    hasReadme: Boolean(readmeText.trim()),
    lastSyncedAt: new Date(),
  };
}
