/*
  Warnings:

  - Made the column `classId` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `classDivisionId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classDivisionId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "classId" SET NOT NULL,
ALTER COLUMN "classDivisionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classDivisionId_fkey" FOREIGN KEY ("classDivisionId") REFERENCES "ClassDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
