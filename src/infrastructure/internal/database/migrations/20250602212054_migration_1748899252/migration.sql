-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classDivisionId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "classId" DROP NOT NULL,
ALTER COLUMN "classDivisionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classDivisionId_fkey" FOREIGN KEY ("classDivisionId") REFERENCES "ClassDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
