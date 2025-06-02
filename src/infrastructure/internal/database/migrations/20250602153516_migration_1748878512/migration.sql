/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subjectId,calendarId,termId]` on the table `SubjectGrading` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SubjectGrading" ADD COLUMN     "totalContinuousScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "examScore" SET DEFAULT 0,
ALTER COLUMN "totalScore" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "SubjectGrading_studentId_subjectId_calendarId_termId_key" ON "SubjectGrading"("studentId", "subjectId", "calendarId", "termId");
