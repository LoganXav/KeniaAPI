/*
  Warnings:

  - Added the required column `tenantId` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `UserToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserToken" ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
