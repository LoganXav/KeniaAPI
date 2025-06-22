/*
  Warnings:

  - Added the required column `fromClassDivisionId` to the `ClassPromotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toClassDivisionId` to the `ClassPromotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassPromotion" ADD COLUMN     "fromClassDivisionId" INTEGER NOT NULL,
ADD COLUMN     "toClassDivisionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ClassPromotion" ADD CONSTRAINT "ClassPromotion_fromClassDivisionId_fkey" FOREIGN KEY ("fromClassDivisionId") REFERENCES "ClassDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassPromotion" ADD CONSTRAINT "ClassPromotion_toClassDivisionId_fkey" FOREIGN KEY ("toClassDivisionId") REFERENCES "ClassDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
