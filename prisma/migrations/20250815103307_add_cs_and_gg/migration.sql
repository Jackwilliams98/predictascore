/*
  Warnings:

  - Made the column `points` on table `GameweekPrediction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GameweekPrediction" ADD COLUMN     "correctPredictions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalDifference" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "points" SET NOT NULL,
ALTER COLUMN "points" SET DEFAULT -10;
