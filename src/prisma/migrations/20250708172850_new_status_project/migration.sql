/*
  Warnings:

  - You are about to drop the column `completedAt` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `projectStatus` on the `team_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_applications" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "isCompleted" BOOLEAN DEFAULT false,
ADD COLUMN     "projectStatus" TEXT;

-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "completedAt",
DROP COLUMN "isCompleted",
DROP COLUMN "projectStatus";
