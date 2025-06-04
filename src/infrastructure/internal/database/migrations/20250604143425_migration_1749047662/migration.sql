/*
  Warnings:

  - You are about to drop the column `classTeacherId` on the `Class` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_classTeacherId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "classTeacherId";

-- AlterTable
ALTER TABLE "ClassDivision" ADD COLUMN     "classDivisionTeacherId" INTEGER;

-- AddForeignKey
ALTER TABLE "ClassDivision" ADD CONSTRAINT "ClassDivision_classDivisionTeacherId_fkey" FOREIGN KEY ("classDivisionTeacherId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
