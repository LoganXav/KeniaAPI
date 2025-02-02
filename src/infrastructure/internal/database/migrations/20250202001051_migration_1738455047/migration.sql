/*
  Warnings:

  - You are about to alter the column `nin` on the `Staff` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Char(11)`.

*/
-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "nin" SET DATA TYPE CHAR(11);
