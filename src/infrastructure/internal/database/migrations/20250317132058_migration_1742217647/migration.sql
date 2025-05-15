/*
  Warnings:

  - You are about to drop the column `classId` on the `Timetable` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId]` on the table `SchoolCalendar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classDivisionId` to the `Timetable` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Timetable" DROP CONSTRAINT "Timetable_classId_fkey";

-- DropIndex
DROP INDEX "SchoolCalendar_year_key";

-- AlterTable
ALTER TABLE "Timetable" DROP COLUMN "classId",
ADD COLUMN     "classDivisionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SchoolCalendar_tenantId_key" ON "SchoolCalendar"("tenantId");

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_classDivisionId_fkey" FOREIGN KEY ("classDivisionId") REFERENCES "ClassDivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
