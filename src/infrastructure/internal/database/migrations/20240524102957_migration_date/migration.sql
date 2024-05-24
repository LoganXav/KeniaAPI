-- CreateEnum
CREATE TYPE "UserTokenTypesEnum" AS ENUM ('ACCESS', 'REFRESH', 'EMAIL', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'STUDENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "title" VARCHAR(255),
    "country" TEXT,
    "state" TEXT,
    "lga" TEXT,
    "principalId" INTEGER NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Principal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Principal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VicePrincipal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "schoolId" INTEGER,

    CONSTRAINT "VicePrincipal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "tokenType" "UserTokenTypesEnum" NOT NULL,
    "expiresOn" TIMESTAMP(3) NOT NULL,
    "hasExpired" BOOLEAN,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "School_principalId_key" ON "School"("principalId");

-- CreateIndex
CREATE UNIQUE INDEX "Principal_userId_key" ON "Principal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VicePrincipal_userId_key" ON "VicePrincipal"("userId");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "Principal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Principal" ADD CONSTRAINT "Principal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VicePrincipal" ADD CONSTRAINT "VicePrincipal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VicePrincipal" ADD CONSTRAINT "VicePrincipal_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
