/*
  Warnings:

  - You are about to drop the column `address` on the `Guardian` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Guardian` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Guardian` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Guardian` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Guardian" DROP COLUMN "address",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "residentialAddress" TEXT,
ADD COLUMN     "residentialCountryId" INTEGER,
ADD COLUMN     "residentialLgaId" INTEGER,
ADD COLUMN     "residentialStateId" INTEGER,
ADD COLUMN     "residentialZipCode" INTEGER,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "languages";

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_email_key" ON "Guardian"("email");
