-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_memberId_fkey";

-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "memberId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
