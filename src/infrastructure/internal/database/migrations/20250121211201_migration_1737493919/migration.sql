-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_tenantId_fkey";

-- AlterTable
ALTER TABLE "UserToken" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
