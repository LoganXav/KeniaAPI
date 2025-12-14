/*
  Warnings:

  - A unique constraint covering the columns `[studentCalendarResultId,termId,tenantId]` on the table `StudentCalendarTermAverage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudentCalendarTermAverage_studentCalendarResultId_termId_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudentCalendarTermAverage_studentCalendarResultId_termId_t_key" ON "StudentCalendarTermAverage"("studentCalendarResultId", "termId", "tenantId");
