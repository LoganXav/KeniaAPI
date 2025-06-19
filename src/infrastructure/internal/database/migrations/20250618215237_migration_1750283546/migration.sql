/*
  Warnings:

  - You are about to drop the `_StudentSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StudentSubject" DROP CONSTRAINT "_StudentSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentSubject" DROP CONSTRAINT "_StudentSubject_B_fkey";

-- DropTable
DROP TABLE "_StudentSubject";
