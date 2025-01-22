/*
  Warnings:

  - You are about to drop the column `city` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `lga` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `ownershipType` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `residentialCity` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `residentialCountry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `residentialState` on the `User` table. All the data in the column will be lost.
  - The `residentialZipCode` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "city",
DROP COLUMN "lga",
DROP COLUMN "ownershipType",
DROP COLUMN "state",
ADD COLUMN     "countryId" INTEGER,
ADD COLUMN     "lgaId" INTEGER,
ADD COLUMN     "stateId" INTEGER,
ADD COLUMN     "zipCode" INTEGER,
ALTER COLUMN "postalCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "residentialCity",
DROP COLUMN "residentialCountry",
DROP COLUMN "residentialState",
ADD COLUMN     "residentialCountryId" INTEGER,
ADD COLUMN     "residentialLgaId" INTEGER,
ADD COLUMN     "residentialStateId" INTEGER,
DROP COLUMN "residentialZipCode",
ADD COLUMN     "residentialZipCode" INTEGER;
