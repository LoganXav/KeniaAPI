/*
  Warnings:

  - You are about to drop the column `calendarId` on the `StudentTermResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,termId,tenantId]` on the table `StudentTermResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "StudentTermResult" DROP CONSTRAINT "StudentTermResult_calendarId_fkey";

-- DropIndex
DROP INDEX "StudentTermResult_studentId_calendarId_termId_tenantId_key";

-- AlterTable
ALTER TABLE "StudentTermResult" DROP COLUMN "calendarId",
ADD COLUMN     "schoolCalendarId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "StudentTermResult_studentId_termId_tenantId_key" ON "StudentTermResult"("studentId", "termId", "tenantId");

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_schoolCalendarId_fkey" FOREIGN KEY ("schoolCalendarId") REFERENCES "SchoolCalendar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
