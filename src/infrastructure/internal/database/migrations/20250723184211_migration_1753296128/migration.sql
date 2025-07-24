-- CreateTable
CREATE TABLE "StudentSessionResult" (
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

    CONSTRAINT "StudentSessionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentSessionResult_studentId_calendarId_key" ON "StudentSessionResult"("studentId", "calendarId");

-- AddForeignKey
ALTER TABLE "StudentSessionResult" ADD CONSTRAINT "StudentSessionResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSessionResult" ADD CONSTRAINT "StudentSessionResult_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "SchoolCalendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSessionResult" ADD CONSTRAINT "StudentSessionResult_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
