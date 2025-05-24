-- CreateTable
CREATE TABLE "_TenantGradingStructureClass" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TenantGradingStructureClass_AB_unique" ON "_TenantGradingStructureClass"("A", "B");

-- CreateIndex
CREATE INDEX "_TenantGradingStructureClass_B_index" ON "_TenantGradingStructureClass"("B");

-- AddForeignKey
ALTER TABLE "_TenantGradingStructureClass" ADD CONSTRAINT "_TenantGradingStructureClass_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TenantGradingStructureClass" ADD CONSTRAINT "_TenantGradingStructureClass_B_fkey" FOREIGN KEY ("B") REFERENCES "TenantGradingStructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
