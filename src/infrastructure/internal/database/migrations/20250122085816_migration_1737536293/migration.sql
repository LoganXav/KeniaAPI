/*
  Warnings:

  - You are about to drop the column `address` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "city" INTEGER,
ADD COLUMN     "lga" INTEGER,
ADD COLUMN     "ownershipType" INTEGER,
ADD COLUMN     "postalCode" INTEGER,
ADD COLUMN     "state" INTEGER;
