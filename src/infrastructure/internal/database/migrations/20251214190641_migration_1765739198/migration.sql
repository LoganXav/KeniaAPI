/*
  Warnings:

  - Added the required column `tenantId` to the `StudentCalendarTermAverage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentCalendarTermAverage" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentCalendarTermAverage" ADD CONSTRAINT "StudentCalendarTermAverage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
