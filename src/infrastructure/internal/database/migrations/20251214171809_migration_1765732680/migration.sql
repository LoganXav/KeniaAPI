/*
  Warnings:

  - You are about to drop the column `averageScore` on the `StudentCalendarResult` table. All the data in the column will be lost.
  - You are about to drop the column `subjectCountGraded` on the `StudentCalendarResult` table. All the data in the column will be lost.
  - You are about to drop the column `totalScore` on the `StudentCalendarResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentCalendarResult" DROP COLUMN "averageScore",
DROP COLUMN "subjectCountGraded",
DROP COLUMN "totalScore";

-- CreateTable
CREATE TABLE "StudentCalendarTermAverage" (
    "id" SERIAL NOT NULL,
    "studentCalendarResultId" INTEGER NOT NULL,
    "termId" INTEGER NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StudentCalendarTermAverage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentCalendarTermAverage_studentCalendarResultId_termId_key" ON "StudentCalendarTermAverage"("studentCalendarResultId", "termId");

-- AddForeignKey
ALTER TABLE "StudentCalendarTermAverage" ADD CONSTRAINT "StudentCalendarTermAverage_studentCalendarResultId_fkey" FOREIGN KEY ("studentCalendarResultId") REFERENCES "StudentCalendarResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCalendarTermAverage" ADD CONSTRAINT "StudentCalendarTermAverage_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
