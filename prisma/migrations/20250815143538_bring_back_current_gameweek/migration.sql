-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_currentGameweekId_fkey" FOREIGN KEY ("currentGameweekId") REFERENCES "Gameweek"("id") ON DELETE SET NULL ON UPDATE CASCADE;
