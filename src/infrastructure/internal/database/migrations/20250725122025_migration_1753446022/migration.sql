/*
  Warnings:

  - You are about to drop the `StudentSessionResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentSessionResult" DROP CONSTRAINT "StudentSessionResult_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "StudentSessionResult" DROP CONSTRAINT "StudentSessionResult_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentSessionResult" DROP CONSTRAINT "StudentSessionResult_tenantId_fkey";

-- DropTable
DROP TABLE "StudentSessionResult";

-- CreateTable
CREATE TABLE "StudentCalendarResult" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "calendarId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subjectCount" INTEGER NOT NULL DEFAULT 0,
    "finalized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentCalendarResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTermResult" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "calendarId" INTEGER NOT NULL,
    "termId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subjectCount" INTEGER NOT NULL DEFAULT 0,
    "finalized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentTermResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentCalendarResult_studentId_calendarId_key" ON "StudentCalendarResult"("studentId", "calendarId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTermResult_studentId_calendarId_termId_key" ON "StudentTermResult"("studentId", "calendarId", "termId");

-- AddForeignKey
ALTER TABLE "StudentCalendarResult" ADD CONSTRAINT "StudentCalendarResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCalendarResult" ADD CONSTRAINT "StudentCalendarResult_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "SchoolCalendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCalendarResult" ADD CONSTRAINT "StudentCalendarResult_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "SchoolCalendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTermResult" ADD CONSTRAINT "StudentTermResult_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
