/*
  Warnings:

  - You are about to drop the column `fullName` on the `team_members` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `team_members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL;
