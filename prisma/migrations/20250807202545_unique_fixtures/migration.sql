/*
  Warnings:

  - A unique constraint covering the columns `[kickoff,homeTeam,awayTeam]` on the table `Fixture` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fixture_kickoff_homeTeam_awayTeam_key" ON "Fixture"("kickoff", "homeTeam", "awayTeam");
