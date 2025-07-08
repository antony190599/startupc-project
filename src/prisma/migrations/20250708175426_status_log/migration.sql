/*
  Warnings:

  - You are about to drop the `ProjectStatusLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectStatusLog" DROP CONSTRAINT "ProjectStatusLog_projectApplicationId_fkey";

-- DropTable
DROP TABLE "ProjectStatusLog";

-- CreateTable
CREATE TABLE "project_status_logs" (
    "id" TEXT NOT NULL,
    "projectApplicationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_status_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_status_logs" ADD CONSTRAINT "project_status_logs_projectApplicationId_fkey" FOREIGN KEY ("projectApplicationId") REFERENCES "project_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
