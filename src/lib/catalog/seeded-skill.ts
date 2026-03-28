import { SkillPublishStatus, SkillSourceType } from "@prisma/client";

export type LockedSkillEntry = {
  name?: string;
  aliases?: string[];
  source: string;
  sourceType: string;
  computedHash: string;
};

export function getLegacySeededSlugs({
  slug,
  skill,
}: {
  slug: string;
  skill: LockedSkillEntry;
}) {
  const canonicalSlug = skill.name ?? slug;

  return Array.from(new Set([slug, ...(skill.aliases ?? [])])).filter(
    (value) => value !== canonicalSlug,
  );
}

export function buildSeededSkillData({
  slug,
  skill,
}: {
  slug: string;
  skill: LockedSkillEntry;
}) {
  const [repoOwner, repoName] = skill.source.split("/");
  const name = skill.name ?? slug;
  const normalizedTags = Array.from(
    new Set([name, ...getLegacySeededSlugs({ slug, skill })]),
  );
  const styleCues = Array.from(
    new Set(
      [name, ...getLegacySeededSlugs({ slug, skill })]
        .flatMap((value) => value.split("-"))
        .filter((value) => value.length > 0),
    ),
  );

  return {
    name,
    slug: name,
    sourceRepo: skill.source,
    repoUrl: `https://github.com/${skill.source}`,
    repoOwner,
    repoName,
    sourceType: SkillSourceType.SEEDED,
    publishStatus: SkillPublishStatus.PUBLISHED,
    computedHash: skill.computedHash,
    hasReadme: true,
    topics: ["ui", "ux", "design-system"],
    normalizedTags,
    styleCues,
  };
}
