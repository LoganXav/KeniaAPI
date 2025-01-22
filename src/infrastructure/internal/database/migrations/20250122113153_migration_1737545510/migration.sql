-- CreateEnum
CREATE TYPE "TenantOnboardingStatusType" AS ENUM ('PERSONAL', 'RESIDENTIAL', 'SCHOOL', 'COMPLETE');

-- DropIndex
DROP INDEX "Role_name_key";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "onboardingStatus" "TenantOnboardingStatusType" NOT NULL DEFAULT 'PERSONAL';
