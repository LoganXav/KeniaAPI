/*
  Warnings:

  - The `classTeacherId` column on the `Class` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `staffId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `isFirstTimeLogin` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `teacherId` on the `Subject` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STUDENT', 'STAFF');

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_classTeacherId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_staffId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_studentId_fkey";

-- DropIndex
DROP INDEX "Staff_staffId_key";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "classTeacherId",
ADD COLUMN     "classTeacherId" INTEGER;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "staffId",
ADD COLUMN     "roleId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "isFirstTimeLogin",
DROP COLUMN "tenantId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "teacherId",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
DROP COLUMN "staffId",
DROP COLUMN "studentId",
ADD COLUMN     "userType" "UserType";

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
