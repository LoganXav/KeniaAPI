-- AlterTable
ALTER TABLE "Guardian" ALTER COLUMN "firstName" SET DEFAULT '',
ALTER COLUMN "lastName" SET DEFAULT '',
ALTER COLUMN "phoneNumber" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "classDivisionId" INTEGER;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classDivisionId_fkey" FOREIGN KEY ("classDivisionId") REFERENCES "ClassDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
