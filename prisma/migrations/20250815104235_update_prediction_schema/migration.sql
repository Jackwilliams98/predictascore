-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "correctScore" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "goalDifference" INTEGER;
