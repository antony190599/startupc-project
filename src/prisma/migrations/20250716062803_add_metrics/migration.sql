-- AlterTable
ALTER TABLE "project_applications" ADD COLUMN     "hasExternalInvestment" TEXT,
ADD COLUMN     "hasPilot" TEXT,
ADD COLUMN     "hasSales" TEXT,
ADD COLUMN     "hasTechTeam" TEXT,
ADD COLUMN     "investmentAmount" TEXT,
ADD COLUMN     "investmentCurrency" TEXT,
ADD COLUMN     "pilotDescription" TEXT,
ADD COLUMN     "pilotLink" TEXT,
ADD COLUMN     "salesCurrency" TEXT,
ADD COLUMN     "solutionApplication" TEXT,
ADD COLUMN     "technologyUsed" TEXT,
ADD COLUMN     "totalSales" TEXT;
