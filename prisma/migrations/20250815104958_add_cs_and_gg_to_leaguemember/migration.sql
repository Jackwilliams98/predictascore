-- AlterTable
ALTER TABLE "LeagueMember" ADD COLUMN     "correctPredictions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalDifference" INTEGER NOT NULL DEFAULT 0;
