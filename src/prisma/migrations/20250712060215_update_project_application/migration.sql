-- AlterTable
ALTER TABLE "project_applications" ADD COLUMN     "programId" TEXT;

-- AddForeignKey
ALTER TABLE "project_applications" ADD CONSTRAINT "project_applications_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
