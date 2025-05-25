/*
  Warnings:

  - A unique constraint covering the columns `[admissionNo,tenantId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_admissionNo_key";

-- CreateTable
CREATE TABLE "GradeBoundary" (
    "id" SERIAL NOT NULL,
    "tenantGradingStructureId" INTEGER NOT NULL,
    "minimumScore" INTEGER NOT NULL,
    "maximumScore" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeBoundary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_admissionNo_tenantId_key" ON "Student"("admissionNo", "tenantId");

-- AddForeignKey
ALTER TABLE "GradeBoundary" ADD CONSTRAINT "GradeBoundary_tenantGradingStructureId_fkey" FOREIGN KEY ("tenantGradingStructureId") REFERENCES "TenantGradingStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
