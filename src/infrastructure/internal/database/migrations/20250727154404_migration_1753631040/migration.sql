/*
  Warnings:

  - You are about to drop the column `schoolCalendarId` on the `StudentTermResult` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentTermResult" DROP CONSTRAINT "StudentTermResult_schoolCalendarId_fkey";

-- AlterTable
ALTER TABLE "StudentTermResult" DROP COLUMN "schoolCalendarId";
