-- CreateEnum
CREATE TYPE "SkillSourceType" AS ENUM ('SEEDED', 'GITHUB_DISCOVERED');

-- CreateEnum
CREATE TYPE "SkillPublishStatus" AS ENUM ('PUBLISHED', 'DISABLED', 'EXCLUDED');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "SyncRunStatus" AS ENUM ('SUCCEEDED', 'FAILED', 'PARTIAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sourceType" "SkillSourceType" NOT NULL,
    "publishStatus" "SkillPublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sourceRepo" TEXT,
    "repoUrl" TEXT,
    "repoOwner" TEXT,
    "repoName" TEXT,
    "description" TEXT,
    "githubStars" INTEGER NOT NULL DEFAULT 0,
    "topics" TEXT[],
    "normalizedTags" TEXT[],
    "styleCues" TEXT[],
    "readmeSummary" TEXT,
    "readmeContent" TEXT,
    "computedHash" TEXT,
    "hasReadme" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillSyncRun" (
    "id" TEXT NOT NULL,
    "status" "SyncRunStatus" NOT NULL,
    "searchQuery" TEXT,
    "discoveredCount" INTEGER NOT NULL DEFAULT 0,
    "publishedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillSyncRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,
    "componentType" TEXT NOT NULL,
    "status" "GenerationStatus" NOT NULL DEFAULT 'SUCCEEDED',
    "model" TEXT NOT NULL,
    "promptSnapshot" JSONB NOT NULL,
    "resultCode" TEXT NOT NULL,
    "previewPayload" JSONB NOT NULL,
    "rationale" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationSkillSelection" (
    "generationId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "GenerationSkillSelection_pkey" PRIMARY KEY ("generationId","skillId")
);

-- CreateTable
CREATE TABLE "DailyUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogRuleConfig" (
    "id" TEXT NOT NULL,
    "minStars" INTEGER NOT NULL DEFAULT 1000,
    "requiredTopics" TEXT[],
    "readmeKeywords" TEXT[],
    "autoPublishEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogRuleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE INDEX "Skill_publishStatus_idx" ON "Skill"("publishStatus");

-- CreateIndex
CREATE INDEX "Skill_sourceType_idx" ON "Skill"("sourceType");

-- CreateIndex
CREATE INDEX "ComponentGeneration_userId_createdAt_idx" ON "ComponentGeneration"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ComponentGeneration_guestId_createdAt_idx" ON "ComponentGeneration"("guestId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailyUsage_userId_date_key" ON "DailyUsage"("userId", "date");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentGeneration" ADD CONSTRAINT "ComponentGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationSkillSelection" ADD CONSTRAINT "GenerationSkillSelection_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "ComponentGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationSkillSelection" ADD CONSTRAINT "GenerationSkillSelection_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyUsage" ADD CONSTRAINT "DailyUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
