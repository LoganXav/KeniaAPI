/*
  Warnings:

  - You are about to drop the column `contactPhone` on the `staff` table. All the data in the column will be lost.
  - You are about to alter the column `employmentType` on the `staff` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `staff` DROP COLUMN `contactPhone`,
    MODIFY `employmentType` VARCHAR(191) NOT NULL DEFAULT 'FULLTIME';
