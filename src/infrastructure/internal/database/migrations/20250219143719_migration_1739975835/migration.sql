/*
  Warnings:

  - You are about to drop the column `currentGrade` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `previousSchool` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `SubjectTeacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DormitoryToStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GuardianToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_staffId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "_DormitoryToStudent" DROP CONSTRAINT "_DormitoryToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_DormitoryToStudent" DROP CONSTRAINT "_DormitoryToStudent_B_fkey";

-- DropForeignKey
ALTER TABLE "_GuardianToStudent" DROP CONSTRAINT "_GuardianToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_GuardianToStudent" DROP CONSTRAINT "_GuardianToStudent_B_fkey";

-- DropIndex
DROP INDEX "Student_studentId_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "currentGrade",
DROP COLUMN "isActive",
DROP COLUMN "previousSchool",
DROP COLUMN "studentId",
ADD COLUMN     "dormitoryId" INTEGER;

-- DropTable
DROP TABLE "SubjectTeacher";

-- DropTable
DROP TABLE "_DormitoryToStudent";

-- DropTable
DROP TABLE "_GuardianToStudent";

-- CreateTable
CREATE TABLE "_SubjectTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StudentGuardian" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectTeacher_AB_unique" ON "_SubjectTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectTeacher_B_index" ON "_SubjectTeacher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentGuardian_AB_unique" ON "_StudentGuardian"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentGuardian_B_index" ON "_StudentGuardian"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_dormitoryId_fkey" FOREIGN KEY ("dormitoryId") REFERENCES "Dormitory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectTeacher" ADD CONSTRAINT "_SubjectTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectTeacher" ADD CONSTRAINT "_SubjectTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGuardian" ADD CONSTRAINT "_StudentGuardian_A_fkey" FOREIGN KEY ("A") REFERENCES "Guardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentGuardian" ADD CONSTRAINT "_StudentGuardian_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
