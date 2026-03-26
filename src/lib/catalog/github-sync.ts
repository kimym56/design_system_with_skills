import {
  SkillPublishStatus,
  SkillSourceType,
  SyncRunStatus,
  type PrismaClient,
} from "@prisma/client";
import { Octokit } from "octokit";

import { db } from "@/lib/db";
import { getEnv } from "@/lib/env";
import {
  DEFAULT_RULES,
  qualifiesForAutoPublish,
  type CatalogRules,
} from "@/lib/catalog/catalog-rules";
import { normalizeSkill } from "@/lib/catalog/skill-normalizer";

type SearchRepo = {
  id: number;
  full_name: string;
  stargazers_count: number;
  topics?: string[];
  private: boolean;
  description?: string | null;
  html_url?: string;
};

export const DEFAULT_SEARCH_QUERIES = [
  "design system skill language:Markdown stars:>=1000",
  "ui ux skill language:Markdown stars:>=1000",
];

export function mapSearchResultToCandidate(result: SearchRepo) {
  const [repoOwner, repoName] = result.full_name.split("/");

  return {
    id: result.id,
    fullName: result.full_name,
    repoOwner,
    repoName,
    repoUrl: result.html_url ?? `https://github.com/${result.full_name}`,
    description: result.description ?? null,
    stars: result.stargazers_count,
    topics: result.topics ?? [],
    isPrivate: result.private,
  };
}

async function fetchReadme(
  octokit: Octokit,
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

export async function syncGitHubSkills({
  prisma = db,
  octokit = new Octokit({ auth: getEnv().GITHUB_TOKEN }),
  rules = DEFAULT_RULES,
  queries = DEFAULT_SEARCH_QUERIES,
}: {
  prisma?: PrismaClient;
  octokit?: Octokit;
  rules?: CatalogRules;
  queries?: string[];
} = {}) {
  const syncRun = await prisma.skillSyncRun.create({
    data: {
      status: SyncRunStatus.PARTIAL,
      searchQuery: queries.join(" | "),
    },
  });

  const deduped = new Map<string, ReturnType<typeof mapSearchResultToCandidate>>();

  for (const query of queries) {
    const response = await octokit.request("GET /search/repositories", {
      q: query,
      sort: "stars",
      order: "desc",
      per_page: 25,
    });

    for (const repo of response.data.items as SearchRepo[]) {
      const candidate = mapSearchResultToCandidate(repo);
      deduped.set(candidate.fullName, candidate);
    }
  }

  let publishedCount = 0;
  let skippedCount = 0;

  for (const candidate of deduped.values()) {
    const readmeText = await fetchReadme(
      octokit,
      candidate.repoOwner,
      candidate.repoName,
    );

    const shouldPublish = qualifiesForAutoPublish(
      {
        isPrivate: candidate.isPrivate,
        stars: candidate.stars,
        topics: candidate.topics,
        hasReadme: Boolean(readmeText),
        readmeText,
      },
      rules,
    );

    if (!shouldPublish) {
      skippedCount += 1;
      continue;
    }

    const skillData = normalizeSkill({
      fullName: candidate.fullName,
      description: candidate.description,
      stars: candidate.stars,
      topics: candidate.topics,
      readmeText,
      sourceType: SkillSourceType.GITHUB_DISCOVERED,
      publishStatus: SkillPublishStatus.PUBLISHED,
    });

    await prisma.skill.upsert({
      where: { slug: skillData.slug },
      update: skillData,
      create: skillData,
    });

    publishedCount += 1;
  }

  return prisma.skillSyncRun.update({
    where: { id: syncRun.id },
    data: {
      status: SyncRunStatus.SUCCEEDED,
      discoveredCount: deduped.size,
      publishedCount,
      skippedCount,
      finishedAt: new Date(),
    },
  });
}
