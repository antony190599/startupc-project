-- CreateTable
CREATE TABLE "ProjectStatusLog" (
    "id" TEXT NOT NULL,
    "projectApplicationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectStatusLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectStatusLog" ADD CONSTRAINT "ProjectStatusLog_projectApplicationId_fkey" FOREIGN KEY ("projectApplicationId") REFERENCES "project_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
