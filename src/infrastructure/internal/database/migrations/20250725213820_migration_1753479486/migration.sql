/*
  Warnings:

  - A unique constraint covering the columns `[studentId,calendarId,tenantId]` on the table `StudentCalendarResult` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,calendarId,termId,tenantId]` on the table `StudentTermResult` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,subjectId,calendarId,termId,tenantId]` on the table `SubjectGrading` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudentCalendarResult_studentId_calendarId_key";

-- DropIndex
DROP INDEX "StudentTermResult_studentId_calendarId_termId_key";

-- DropIndex
DROP INDEX "SubjectGrading_studentId_subjectId_calendarId_termId_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudentCalendarResult_studentId_calendarId_tenantId_key" ON "StudentCalendarResult"("studentId", "calendarId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTermResult_studentId_calendarId_termId_tenantId_key" ON "StudentTermResult"("studentId", "calendarId", "termId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectGrading_studentId_subjectId_calendarId_termId_tenant_key" ON "SubjectGrading"("studentId", "subjectId", "calendarId", "termId", "tenantId");
