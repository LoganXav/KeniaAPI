/*
  Warnings:

  - You are about to drop the column `email` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `isFirstTimeLogin` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `roleListId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Instructor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StaffDepartment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_roleListId_fkey";

-- DropForeignKey
ALTER TABLE "_RoleFeatures" DROP CONSTRAINT "_RoleFeatures_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleFeatures" DROP CONSTRAINT "_RoleFeatures_B_fkey";

-- DropForeignKey
ALTER TABLE "_StaffDepartment" DROP CONSTRAINT "_StaffDepartment_A_fkey";

-- DropForeignKey
ALTER TABLE "_StaffDepartment" DROP CONSTRAINT "_StaffDepartment_B_fkey";

-- DropIndex
DROP INDEX "Staff_email_key";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "isFirstTimeLogin",
DROP COLUMN "lastName",
DROP COLUMN "password",
DROP COLUMN "phoneNumber",
DROP COLUMN "roleListId",
DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "roleId" INTEGER,
ADD COLUMN     "staffId" TEXT,
ADD COLUMN     "studentId" TEXT;

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "Features";

-- DropTable
DROP TABLE "Instructor";

-- DropTable
DROP TABLE "RoleList";

-- DropTable
DROP TABLE "_RoleFeatures";

-- DropTable
DROP TABLE "_StaffDepartment";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StaffGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RolePermission" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupId_key" ON "Group"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_StaffGroup_AB_unique" ON "_StaffGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_StaffGroup_B_index" ON "_StaffGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RolePermission_AB_unique" ON "_RolePermission"("A", "B");

-- CreateIndex
CREATE INDEX "_RolePermission_B_index" ON "_RolePermission"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("staffId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffGroup" ADD CONSTRAINT "_StaffGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffGroup" ADD CONSTRAINT "_StaffGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermission" ADD CONSTRAINT "_RolePermission_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermission" ADD CONSTRAINT "_RolePermission_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
