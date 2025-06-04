/*
  Warnings:

  - A unique constraint covering the columns `[year,tenantId]` on the table `SchoolCalendar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SchoolCalendar_year_tenantId_key" ON "SchoolCalendar"("year", "tenantId");
