/*
  Warnings:

  - Added the required column `tenantId` to the `SubjectGrading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `SubjectGradingStructure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectGrading" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SubjectGradingStructure" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SubjectGradingStructure" ADD CONSTRAINT "SubjectGradingStructure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrading" ADD CONSTRAINT "SubjectGrading_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
