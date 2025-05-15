/*
  Warnings:

  - Made the column `classId` on table `Subject` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_classId_fkey";

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "description" TEXT,
ALTER COLUMN "classId" SET NOT NULL;

-- CreateTable
CREATE TABLE "_SubjectClassDivision" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectClassDivision_AB_unique" ON "_SubjectClassDivision"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectClassDivision_B_index" ON "_SubjectClassDivision"("B");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectClassDivision" ADD CONSTRAINT "_SubjectClassDivision_A_fkey" FOREIGN KEY ("A") REFERENCES "ClassDivision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectClassDivision" ADD CONSTRAINT "_SubjectClassDivision_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
