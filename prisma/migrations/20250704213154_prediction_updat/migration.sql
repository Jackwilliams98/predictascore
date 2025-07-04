/*
  Warnings:

  - A unique constraint covering the columns `[gameweekPredictionId,fixtureId]` on the table `Prediction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Prediction_gameweekPredictionId_fixtureId_key" ON "Prediction"("gameweekPredictionId", "fixtureId");
