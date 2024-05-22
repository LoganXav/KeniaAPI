/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "country" TEXT,
    "state" TEXT,
    "lga" TEXT,
    "principalId" INTEGER,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Principal" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "schoolId" INTEGER,

    CONSTRAINT "Principal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_principalId_key" ON "School"("principalId");

-- CreateIndex
CREATE UNIQUE INDEX "Principal_email_key" ON "Principal"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Principal_schoolId_key" ON "Principal"("schoolId");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "Principal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
