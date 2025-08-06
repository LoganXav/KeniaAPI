/*
  Warnings:

  - Added the required column `classDivisionId` to the `StudentCalendarResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `StudentCalendarResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentCalendarResult" ADD COLUMN     "classDivisionId" INTEGER NOT NULL,
ADD COLUMN     "classId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentCalendarResult" ADD CONSTRAINT "StudentCalendarResult_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCalendarResult" ADD CONSTRAINT "StudentCalendarResult_classDivisionId_fkey" FOREIGN KEY ("classDivisionId") REFERENCES "ClassDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
