/*
  Warnings:

  - You are about to drop the column `subjectCount` on the `StudentCalendarResult` table. All the data in the column will be lost.
  - You are about to drop the column `subjectCount` on the `StudentTermResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentCalendarResult" DROP COLUMN "subjectCount",
ADD COLUMN     "subjectCountGraded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subjectCountOffered" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StudentTermResult" DROP COLUMN "subjectCount",
ADD COLUMN     "subjectCountGraded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subjectCountOffered" INTEGER NOT NULL DEFAULT 0;
