/*
  Warnings:

  - Made the column `memberId` on table `Workout` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_memberId_fkey";

-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "memberId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
