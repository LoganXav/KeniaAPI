/*
  Warnings:

  - You are about to drop the column `caWeight` on the `TenantGradingStructure` table. All the data in the column will be lost.
  - You are about to drop the `CaBreakdownItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CaScore` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `staffId` to the `SubjectGradingStructure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `continuousAssessmentWeight` to the `TenantGradingStructure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CaBreakdownItem" DROP CONSTRAINT "CaBreakdownItem_subjectGradingStructureId_fkey";

-- DropForeignKey
ALTER TABLE "CaScore" DROP CONSTRAINT "CaScore_subjectGradingId_fkey";

-- AlterTable
ALTER TABLE "SubjectGradingStructure" ADD COLUMN     "staffId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TenantGradingStructure" DROP COLUMN "caWeight",
ADD COLUMN     "continuousAssessmentWeight" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CaBreakdownItem";

-- DropTable
DROP TABLE "CaScore";

-- CreateTable
CREATE TABLE "ContinuousAssessmentBreakdownItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "subjectGradingStructureId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContinuousAssessmentBreakdownItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContinuousAssessmentScore" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "subjectGradingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContinuousAssessmentScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubjectGradingStructure" ADD CONSTRAINT "SubjectGradingStructure_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContinuousAssessmentBreakdownItem" ADD CONSTRAINT "ContinuousAssessmentBreakdownItem_subjectGradingStructureI_fkey" FOREIGN KEY ("subjectGradingStructureId") REFERENCES "SubjectGradingStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContinuousAssessmentScore" ADD CONSTRAINT "ContinuousAssessmentScore_subjectGradingId_fkey" FOREIGN KEY ("subjectGradingId") REFERENCES "SubjectGrading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
