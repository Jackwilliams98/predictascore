-- CreateTable
CREATE TABLE "GameweekLeague" (
    "id" TEXT NOT NULL,
    "gameweekId" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,

    CONSTRAINT "GameweekLeague_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameweekLeague_gameweekId_leagueId_key" ON "GameweekLeague"("gameweekId", "leagueId");

-- AddForeignKey
ALTER TABLE "GameweekLeague" ADD CONSTRAINT "GameweekLeague_gameweekId_fkey" FOREIGN KEY ("gameweekId") REFERENCES "Gameweek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameweekLeague" ADD CONSTRAINT "GameweekLeague_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
