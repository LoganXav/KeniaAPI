/*
  Warnings:

  - Added the required column `classDivisionId` to the `SubjectGrading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectGrading" ADD COLUMN     "classDivisionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SubjectGrading" ADD CONSTRAINT "SubjectGrading_classDivisionId_fkey" FOREIGN KEY ("classDivisionId") REFERENCES "ClassDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
