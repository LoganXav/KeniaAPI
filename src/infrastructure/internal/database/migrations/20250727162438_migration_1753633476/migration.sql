/*
  Warnings:

  - Made the column `classDivisionId` on table `StudentTermResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `classId` on table `StudentTermResult` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "StudentTermResult" DROP CONSTRAINT "StudentTermResult_classDivisionId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTermResult" DROP CONSTRAINT "StudentTermResult_classId_fkey";

-- AlterTable
ALTER TABLE "StudentTermResult" ALTER COLUMN "classDivisionId" SET NOT NULL,
ALTER COLUMN "classId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_classDivisionId_fkey" FOREIGN KEY ("classDivisionId") REFERENCES "ClassDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
