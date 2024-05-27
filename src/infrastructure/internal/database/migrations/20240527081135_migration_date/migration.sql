/*
  Warnings:

  - The values [TEACHER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expiresOn` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the column `hasExpired` on the `UserToken` table. All the data in the column will be lost.
  - You are about to drop the `Principal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VicePrincipal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tenantId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `UserToken` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tokenType` on the `UserToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL', 'ACCESS', 'REFRESH');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PROPRIETOR', 'PRINCIPAL', 'VICE_PRINCIPAL', 'ADMISSIONS_OFFICER', 'INSTRUCTOR', 'STUDENT');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Principal" DROP CONSTRAINT "Principal_userId_fkey";

-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_principalId_fkey";

-- DropForeignKey
ALTER TABLE "VicePrincipal" DROP CONSTRAINT "VicePrincipal_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "VicePrincipal" DROP CONSTRAINT "VicePrincipal_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "phoneNumber",
DROP COLUMN "updatedAt",
ADD COLUMN     "hasVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "expiresOn",
DROP COLUMN "hasExpired",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "tokenType",
ADD COLUMN     "tokenType" "TokenType" NOT NULL;

-- DropTable
DROP TABLE "Principal";

-- DropTable
DROP TABLE "School";

-- DropTable
DROP TABLE "VicePrincipal";

-- DropEnum
DROP TYPE "UserTokenTypesEnum";

-- CreateTable
CREATE TABLE "Tenant" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "address" TEXT,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subjectsTaught" TEXT NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "enrollmentDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_userId_key" ON "Instructor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
