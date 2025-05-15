/*
  Warnings:

  - The values [OTHER] on the enum `ClassList` will be removed. If these variants are still used in the database, this will fail.
  - The values [FULL_TIME,PART_TIME] on the enum `StaffEmploymentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bloodGroup` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `Student` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ClassList_new" AS ENUM ('JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3');
ALTER TABLE "Class" ALTER COLUMN "type" TYPE "ClassList_new" USING ("type"::text::"ClassList_new");
ALTER TYPE "ClassList" RENAME TO "ClassList_old";
ALTER TYPE "ClassList_new" RENAME TO "ClassList";
DROP TYPE "ClassList_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StaffEmploymentType_new" AS ENUM ('FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERNSHIP');
ALTER TABLE "Staff" ALTER COLUMN "employmentType" DROP DEFAULT;
ALTER TABLE "Staff" ALTER COLUMN "employmentType" TYPE "StaffEmploymentType_new" USING ("employmentType"::text::"StaffEmploymentType_new");
ALTER TYPE "StaffEmploymentType" RENAME TO "StaffEmploymentType_old";
ALTER TYPE "StaffEmploymentType_new" RENAME TO "StaffEmploymentType";
DROP TYPE "StaffEmploymentType_old";
ALTER TABLE "Staff" ALTER COLUMN "employmentType" SET DEFAULT 'FULLTIME';
COMMIT;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "employmentType" SET DEFAULT 'FULLTIME';

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "bloodGroup",
DROP COLUMN "religion",
ALTER COLUMN "enrollmentDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "religion" TEXT;
