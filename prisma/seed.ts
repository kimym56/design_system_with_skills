import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SkillPublishStatus, SkillSourceType } from "@prisma/client";

import skillsLock from "../skills-lock.json";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the Prisma seed script.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});

type SkillsLockFile = {
  skills: Record<
    string,
    {
      source: string;
      sourceType: string;
      computedHash: string;
    }
  >;
};

async function seedCatalogRules() {
  await prisma.catalogRuleConfig.upsert({
    where: { id: "default" },
    update: {
      minStars: 1000,
      requiredTopics: ["ui", "ux", "design-system", "frontend"],
      readmeKeywords: ["design system", "component", "ui", "ux"],
      autoPublishEnabled: true,
    },
    create: {
      id: "default",
      minStars: 1000,
      requiredTopics: ["ui", "ux", "design-system", "frontend"],
      readmeKeywords: ["design system", "component", "ui", "ux"],
      autoPublishEnabled: true,
    },
  });
}

async function seedSkills() {
  const entries = Object.entries((skillsLock as SkillsLockFile).skills);

  for (const [name, skill] of entries) {
    const [repoOwner, repoName] = skill.source.split("/");

    await prisma.skill.upsert({
      where: { slug: name },
      update: {
        name,
        sourceRepo: skill.source,
        repoUrl: `https://github.com/${skill.source}`,
        repoOwner,
        repoName,
        sourceType: SkillSourceType.SEEDED,
        publishStatus: SkillPublishStatus.PUBLISHED,
        computedHash: skill.computedHash,
        hasReadme: true,
        topics: ["ui", "ux", "design-system"],
        normalizedTags: [name],
        styleCues: name.split("-"),
      },
      create: {
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
        normalizedTags: [name],
        styleCues: name.split("-"),
      },
    });
  }
}

async function main() {
  await seedCatalogRules();
  await seedSkills();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
