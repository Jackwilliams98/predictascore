/*
  Warnings:

  - You are about to drop the column `leagueId` on the `Gameweek` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seasonId,number]` on the table `Gameweek` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,leagueId,seasonId]` on the table `LeagueMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seasonId` to the `Gameweek` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leagueId` to the `GameweekPrediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonId` to the `GameweekPrediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seasonId` to the `LeagueMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameweekStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Gameweek" DROP CONSTRAINT "Gameweek_leagueId_fkey";

-- DropIndex
DROP INDEX "Gameweek_leagueId_number_key";

-- DropIndex
DROP INDEX "LeagueMember_userId_leagueId_key";

-- AlterTable
ALTER TABLE "Gameweek" DROP COLUMN "leagueId",
ADD COLUMN     "seasonId" TEXT NOT NULL,
ADD COLUMN     "status" "GameweekStatus" NOT NULL DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE "GameweekPrediction" ADD COLUMN     "leagueId" TEXT NOT NULL,
ADD COLUMN     "seasonId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "League" ADD COLUMN     "currentGameweekId" TEXT;

-- AlterTable
ALTER TABLE "LeagueMember" ADD COLUMN     "seasonId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "currentGameweekId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueSeason" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueSeason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_currentGameweekId_key" ON "Season"("currentGameweekId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueSeason_leagueId_seasonId_key" ON "LeagueSeason"("leagueId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "Gameweek_seasonId_number_key" ON "Gameweek"("seasonId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMember_userId_leagueId_seasonId_key" ON "LeagueMember"("userId", "leagueId", "seasonId");

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_currentGameweekId_fkey" FOREIGN KEY ("currentGameweekId") REFERENCES "Gameweek"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_currentGameweekId_fkey" FOREIGN KEY ("currentGameweekId") REFERENCES "Gameweek"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueSeason" ADD CONSTRAINT "LeagueSeason_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueSeason" ADD CONSTRAINT "LeagueSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gameweek" ADD CONSTRAINT "Gameweek_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameweekPrediction" ADD CONSTRAINT "GameweekPrediction_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
