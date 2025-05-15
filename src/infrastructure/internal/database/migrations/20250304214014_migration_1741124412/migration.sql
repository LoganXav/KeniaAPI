-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_roleId_fkey";

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "roleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
