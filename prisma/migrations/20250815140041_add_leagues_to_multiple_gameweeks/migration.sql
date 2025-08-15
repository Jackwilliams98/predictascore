/*
  Warnings:

  - A unique constraint covering the columns `[leagueId,gameweekId]` on the table `GameweekLeague` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "GameweekLeague" DROP CONSTRAINT "GameweekLeague_gameweekId_fkey";

-- DropForeignKey
ALTER TABLE "GameweekLeague" DROP CONSTRAINT "GameweekLeague_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "League" DROP CONSTRAINT "League_currentGameweekId_fkey";

-- DropIndex
DROP INDEX "GameweekLeague_gameweekId_leagueId_key";

-- CreateIndex
CREATE UNIQUE INDEX "GameweekLeague_leagueId_gameweekId_key" ON "GameweekLeague"("leagueId", "gameweekId");

-- AddForeignKey
ALTER TABLE "GameweekLeague" ADD CONSTRAINT "GameweekLeague_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameweekLeague" ADD CONSTRAINT "GameweekLeague_gameweekId_fkey" FOREIGN KEY ("gameweekId") REFERENCES "Gameweek"("id") ON DELETE CASCADE ON UPDATE CASCADE;
