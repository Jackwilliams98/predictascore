-- DropForeignKey
ALTER TABLE "LeagueMember" DROP CONSTRAINT "LeagueMember_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "LeagueSeason" DROP CONSTRAINT "LeagueSeason_leagueId_fkey";

-- AddForeignKey
ALTER TABLE "LeagueSeason" ADD CONSTRAINT "LeagueSeason_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
