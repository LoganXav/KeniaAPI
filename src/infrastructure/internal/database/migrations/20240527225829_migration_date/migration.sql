-- CreateTable
CREATE TABLE "Tenant" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "address" TEXT,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);
