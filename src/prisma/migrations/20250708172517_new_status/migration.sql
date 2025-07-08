-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "isCompleted" BOOLEAN DEFAULT false,
ADD COLUMN     "projectStatus" TEXT;
