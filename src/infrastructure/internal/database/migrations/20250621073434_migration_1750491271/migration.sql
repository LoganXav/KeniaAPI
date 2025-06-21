/*
  Warnings:

  - The values [Awaiting,Repeated] on the enum `PromotionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PromotionStatus_new" AS ENUM ('Promoted', 'Withheld');
ALTER TABLE "ClassPromotion" ALTER COLUMN "promotionStatus" DROP DEFAULT;
ALTER TABLE "ClassPromotion" ALTER COLUMN "promotionStatus" TYPE "PromotionStatus_new" USING ("promotionStatus"::text::"PromotionStatus_new");
ALTER TYPE "PromotionStatus" RENAME TO "PromotionStatus_old";
ALTER TYPE "PromotionStatus_new" RENAME TO "PromotionStatus";
DROP TYPE "PromotionStatus_old";
ALTER TABLE "ClassPromotion" ALTER COLUMN "promotionStatus" SET DEFAULT 'Promoted';
COMMIT;

-- AlterTable
ALTER TABLE "ClassPromotion" ALTER COLUMN "promotionStatus" SET DEFAULT 'Promoted';
