/*
  Warnings:

  - The values [LIVE] on the enum `FixtureStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FixtureStatus_new" AS ENUM ('SCHEDULED', 'IN_PLAY', 'PAUSED', 'FINISHED', 'POSTPONED', 'CANCELLED');
ALTER TABLE "Fixture" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Fixture" ALTER COLUMN "status" TYPE "FixtureStatus_new" USING ("status"::text::"FixtureStatus_new");
ALTER TYPE "FixtureStatus" RENAME TO "FixtureStatus_old";
ALTER TYPE "FixtureStatus_new" RENAME TO "FixtureStatus";
DROP TYPE "FixtureStatus_old";
ALTER TABLE "Fixture" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';
COMMIT;
