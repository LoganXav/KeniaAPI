-- CreateTable
CREATE TABLE "TenantGradingStructure" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "caWeight" INTEGER NOT NULL,
    "examWeight" INTEGER NOT NULL,
    "classIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantGradingStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGradingStructure" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "tenantGradingStructureId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectGradingStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaBreakdownItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "subjectGradingStructureId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaBreakdownItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGrading" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "calendarId" INTEGER NOT NULL,
    "termId" INTEGER NOT NULL,
    "examScore" DOUBLE PRECISION NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectGrading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaScore" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "subjectGradingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TenantGradingStructure" ADD CONSTRAINT "TenantGradingStructure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradingStructure" ADD CONSTRAINT "SubjectGradingStructure_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradingStructure" ADD CONSTRAINT "SubjectGradingStructure_tenantGradingStructureId_fkey" FOREIGN KEY ("tenantGradingStructureId") REFERENCES "TenantGradingStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaBreakdownItem" ADD CONSTRAINT "CaBreakdownItem_subjectGradingStructureId_fkey" FOREIGN KEY ("subjectGradingStructureId") REFERENCES "SubjectGradingStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrading" ADD CONSTRAINT "SubjectGrading_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrading" ADD CONSTRAINT "SubjectGrading_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrading" ADD CONSTRAINT "SubjectGrading_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrading" ADD CONSTRAINT "SubjectGrading_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "SchoolCalendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrading" ADD CONSTRAINT "SubjectGrading_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaScore" ADD CONSTRAINT "CaScore_subjectGradingId_fkey" FOREIGN KEY ("subjectGradingId") REFERENCES "SubjectGrading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
