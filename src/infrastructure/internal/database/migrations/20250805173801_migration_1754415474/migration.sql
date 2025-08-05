/*
  Warnings:

  - You are about to drop the column `subjectCountOffered` on the `StudentCalendarResult` table. All the data in the column will be lost.
  - You are about to drop the column `subjectCountOffered` on the `StudentTermResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentCalendarResult" DROP COLUMN "subjectCountOffered";

-- AlterTable
ALTER TABLE "StudentTermResult" DROP COLUMN "subjectCountOffered";
