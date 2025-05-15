/*
  Warnings:

  - You are about to drop the column `rank` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,tenantId]` on the table `Guardian` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,tenantId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Timetable" DROP CONSTRAINT "Timetable_termId_fkey";

-- DropIndex
DROP INDEX "Guardian_email_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "rank";

-- AlterTable
ALTER TABLE "Timetable" ALTER COLUMN "termId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_email_tenantId_key" ON "Guardian"("email", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_tenantId_key" ON "User"("email", "tenantId");

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE SET NULL ON UPDATE CASCADE;
