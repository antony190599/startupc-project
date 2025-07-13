/*
  Warnings:

  - You are about to drop the column `projectApplicationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_projectApplicationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "projectApplicationId";

-- CreateTable
CREATE TABLE "_UserApplications" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserApplications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserApplications_B_index" ON "_UserApplications"("B");

-- AddForeignKey
ALTER TABLE "_UserApplications" ADD CONSTRAINT "_UserApplications_A_fkey" FOREIGN KEY ("A") REFERENCES "project_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserApplications" ADD CONSTRAINT "_UserApplications_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
