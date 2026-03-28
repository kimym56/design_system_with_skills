import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import {
  buildSeededSkillData,
  getLegacySeededSlugs,
  type LockedSkillEntry,
} from "../src/lib/catalog/seeded-skill";
import { loadCliEnv } from "../src/lib/load-cli-env";
import skillsLock from "../skills-lock.json";

loadCliEnv();

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
  skills: Record<string, LockedSkillEntry>;
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

  for (const [slug, skill] of entries) {
    const seedData = buildSeededSkillData({ slug, skill });
    const legacySlugs = getLegacySeededSlugs({ slug, skill });

    for (const legacySlug of legacySlugs) {
      const existingCanonicalSkill = await prisma.skill.findUnique({
        where: { slug: seedData.slug },
        select: { id: true },
      });

      if (existingCanonicalSkill) {
        break;
      }

      const legacySkill = await prisma.skill.findUnique({
        where: { slug: legacySlug },
        select: { id: true, sourceRepo: true },
      });

      if (legacySkill?.sourceRepo !== skill.source) {
        continue;
      }

      await prisma.skill.update({
        where: { slug: legacySlug },
        data: { slug: seedData.slug },
      });
    }

    await prisma.skill.upsert({
      where: { slug: seedData.slug },
      update: {
        ...seedData,
      },
      create: {
        ...seedData,
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
