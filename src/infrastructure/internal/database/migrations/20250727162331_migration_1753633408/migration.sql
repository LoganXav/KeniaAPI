-- AlterTable
ALTER TABLE "StudentTermResult" ADD COLUMN     "classDivisionId" INTEGER,
ADD COLUMN     "classId" INTEGER;

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_classDivisionId_fkey" FOREIGN KEY ("classDivisionId") REFERENCES "ClassDivision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
