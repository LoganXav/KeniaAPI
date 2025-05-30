/*
  Warnings:

  - A unique constraint covering the columns `[subjectId]` on the table `SubjectGradingStructure` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubjectGradingStructure_subjectId_key" ON "SubjectGradingStructure"("subjectId");
