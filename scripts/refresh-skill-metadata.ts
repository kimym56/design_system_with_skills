import { Octokit } from "@octokit/core";

import { refreshSkillMetadata } from "../src/lib/catalog/refresh-skill-metadata";
import { db } from "../src/lib/db";
import { loadCliEnv } from "../src/lib/load-cli-env";

loadCliEnv();

async function main() {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is required to refresh skill metadata.");
  }

  const result = await refreshSkillMetadata({
    prisma: db,
    octokit: new Octokit({ auth: githubToken }),
  });

  console.log(
    [
      `Checked ${result.checked} skill${result.checked === 1 ? "" : "s"}.`,
      `Updated ${result.updated}.`,
      `Failed ${result.failed}.`,
    ].join(" "),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
