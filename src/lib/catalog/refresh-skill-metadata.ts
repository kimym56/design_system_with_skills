import { SkillPublishStatus, type PrismaClient } from "@prisma/client";
import type { Octokit } from "@octokit/core";

import {
  extractSkillDescriptionFromReadme,
  summarizeReadme,
} from "@/lib/catalog/readme-parser";

type RefreshableSkill = {
  id: string;
  name: string;
  repoOwner: string | null;
  repoName: string | null;
};

type RefreshSkillMetadataDependencies = {
  prisma: Pick<PrismaClient, "skill">;
  octokit: Pick<Octokit, "request">;
};

export type RefreshSkillMetadataResult = {
  checked: number;
  updated: number;
  failed: number;
};

type RepoResponse = {
  description: string | null;
  stargazers_count: number;
};

type RepoMetadata = {
  description: string | null;
  stargazers_count: number;
  readmeText: string;
};

async function fetchReadme(
  octokit: Pick<Octokit, "request">,
  owner: string,
  repo: string,
) {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner,
      repo,
      headers: {
        accept: "application/vnd.github.raw+json",
      },
    });

    return typeof response.data === "string" ? response.data : "";
  } catch {
    return "";
  }
}

export async function refreshSkillMetadata({
  prisma,
  octokit,
}: RefreshSkillMetadataDependencies): Promise<RefreshSkillMetadataResult> {
  const skills = (await prisma.skill.findMany({
    where: {
      publishStatus: SkillPublishStatus.PUBLISHED,
      repoOwner: { not: null },
      repoName: { not: null },
    },
    select: {
      id: true,
      name: true,
      repoOwner: true,
      repoName: true,
    },
    orderBy: [{ name: "asc" }],
  })) as RefreshableSkill[];

  let updated = 0;
  let failed = 0;
  const repoCache = new Map<string, RepoMetadata>();

  for (const skill of skills) {
    if (!skill.repoOwner || !skill.repoName) {
      continue;
    }

    try {
      const cacheKey = `${skill.repoOwner}/${skill.repoName}`;
      let repoMetadata = repoCache.get(cacheKey);

      if (!repoMetadata) {
        const response = await octokit.request("GET /repos/{owner}/{repo}", {
          owner: skill.repoOwner,
          repo: skill.repoName,
        });
        const repo = response.data as RepoResponse;
        const readmeText = await fetchReadme(
          octokit,
          skill.repoOwner,
          skill.repoName,
        );

        repoMetadata = {
          description: repo.description,
          stargazers_count: repo.stargazers_count,
          readmeText,
        };
        repoCache.set(cacheKey, repoMetadata);
      }

      const description =
        extractSkillDescriptionFromReadme(repoMetadata.readmeText, skill.name) ??
        repoMetadata.description;
      const hasReadme = Boolean(repoMetadata.readmeText.trim());

      await prisma.skill.update({
        where: { id: skill.id },
        data: {
          description,
          githubStars: repoMetadata.stargazers_count,
          hasReadme,
          lastSyncedAt: new Date(),
          readmeContent: hasReadme ? repoMetadata.readmeText : null,
          readmeSummary: hasReadme
            ? summarizeReadme(repoMetadata.readmeText)
            : null,
        },
      });

      updated += 1;
    } catch {
      failed += 1;
    }
  }

  return {
    checked: skills.length,
    updated,
    failed,
  };
}
