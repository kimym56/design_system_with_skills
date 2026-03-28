import { expect, test, vi } from "vitest";

import { refreshSkillMetadata } from "@/lib/catalog/refresh-skill-metadata";

test("refreshes published skills with repo coordinates", async () => {
  const findMany = vi.fn(async () => [
    {
      id: "skill-1",
      name: "minimal-ui",
      repoOwner: "acme",
      repoName: "minimal-ui",
    },
  ]);
  const update = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({
    id: "skill-1",
    ...data,
  }));
  const request = vi.fn(async (route: string) => {
    if (route === "GET /repos/{owner}/{repo}") {
      return {
        data: {
          description: "Fresh GitHub description",
          stargazers_count: 4200,
        },
      };
    }

    if (route === "GET /repos/{owner}/{repo}/readme") {
      return {
        data: "",
      };
    }

    throw new Error(`Unexpected route: ${route}`);
  });

  const result = await refreshSkillMetadata({
    prisma: {
      skill: {
        findMany,
        update,
      },
    },
    octokit: {
      request,
    },
  });

  expect(findMany).toHaveBeenCalledWith({
    where: {
      publishStatus: "PUBLISHED",
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
  });
  expect(request).toHaveBeenCalledWith("GET /repos/{owner}/{repo}", {
    owner: "acme",
    repo: "minimal-ui",
  });
  expect(request).toHaveBeenCalledWith("GET /repos/{owner}/{repo}/readme", {
    owner: "acme",
    repo: "minimal-ui",
    headers: {
      accept: "application/vnd.github.raw+json",
    },
  });
  expect(update).toHaveBeenCalledTimes(1);
  expect(update.mock.calls[0]?.[0]?.where).toEqual({ id: "skill-1" });
  expect(update.mock.calls[0]?.[0]?.data).toMatchObject({
    description: "Fresh GitHub description",
    githubStars: 4200,
    hasReadme: false,
    readmeContent: null,
    readmeSummary: null,
  });
  expect(update.mock.calls[0]?.[0]?.data.lastSyncedAt).toBeInstanceOf(Date);
  expect(result).toEqual({
    checked: 1,
    updated: 1,
    failed: 0,
  });
});

test("continues refreshing after one repo lookup fails", async () => {
  const update = vi.fn(async ({ data }: { data: Record<string, unknown> }) => data);
  const request = vi.fn(async (route: string, options?: { repo?: string }) => {
    if (route === "GET /repos/{owner}/{repo}" && options?.repo === "missing-repo") {
      throw new Error("not found");
    }

    if (route === "GET /repos/{owner}/{repo}") {
      return {
        data: {
          description: null,
          stargazers_count: 75,
        },
      };
    }

    if (route === "GET /repos/{owner}/{repo}/readme") {
      return {
        data: "",
      };
    }

    throw new Error(`Unexpected route: ${route}`);
  });

  const result = await refreshSkillMetadata({
    prisma: {
      skill: {
        findMany: vi.fn(async () => [
          {
            id: "skill-1",
            name: "missing-repo",
            repoOwner: "acme",
            repoName: "missing-repo",
          },
          {
            id: "skill-2",
            name: "working-repo",
            repoOwner: "acme",
            repoName: "working-repo",
          },
        ]),
        update,
      },
    },
    octokit: {
      request,
    },
  });

  expect(update).toHaveBeenCalledTimes(1);
  expect(update.mock.calls[0]?.[0]?.where).toEqual({ id: "skill-2" });
  expect(update.mock.calls[0]?.[0]?.data).toMatchObject({
    description: null,
    githubStars: 75,
    hasReadme: false,
    readmeContent: null,
    readmeSummary: null,
  });
  expect(result).toEqual({
    checked: 2,
    updated: 1,
    failed: 1,
  });
});

test("uses a skill-specific README description when a repo publishes multiple skills", async () => {
  const update = vi.fn(async ({ data }: { data: Record<string, unknown> }) => data);
  const request = vi.fn(async (route: string) => {
    if (route === "GET /repos/{owner}/{repo}") {
      return {
        data: {
          description: "Shared repository description",
          stargazers_count: 6061,
        },
      };
    }

    if (route === "GET /repos/{owner}/{repo}/readme") {
      return {
        data: [
          "| Skill | Description |",
          "| --- | --- |",
          "| **taste-skill** | The main design skill for premium frontend code. Covers layout, typography, colors, spacing, and motion. |",
          "| **redesign-skill** | For upgrading existing projects by auditing and fixing design problems first. |",
        ].join("\n"),
      };
    }

    throw new Error(`Unexpected route: ${route}`);
  });

  await refreshSkillMetadata({
    prisma: {
      skill: {
        findMany: vi.fn(async () => [
          {
            id: "skill-1",
            name: "redesign-skill",
            repoOwner: "Leonxlnx",
            repoName: "taste-skill",
          },
        ]),
        update,
      },
    },
    octokit: {
      request,
    },
  });

  expect(update).toHaveBeenCalledTimes(1);
  expect(update.mock.calls[0]?.[0]?.data).toMatchObject({
    description:
      "For upgrading existing projects by auditing and fixing design problems first.",
    githubStars: 6061,
    hasReadme: true,
    readmeContent: [
      "| Skill | Description |",
      "| --- | --- |",
      "| **taste-skill** | The main design skill for premium frontend code. Covers layout, typography, colors, spacing, and motion. |",
      "| **redesign-skill** | For upgrading existing projects by auditing and fixing design problems first. |",
    ].join("\n"),
  });
  expect(update.mock.calls[0]?.[0]?.data.readmeSummary).toEqual(
    expect.any(String),
  );
});
