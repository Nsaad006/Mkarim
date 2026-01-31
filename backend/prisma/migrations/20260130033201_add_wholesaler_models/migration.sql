-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "wholesalerId" TEXT;

-- CreateTable
CREATE TABLE "CapitalEntry" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT,

    CONSTRAINT "CapitalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wholesaler" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT,
    "address" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "contactPerson" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wholesaler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesalerPayment" (
    "id" TEXT NOT NULL,
    "wholesalerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT,
    "notes" TEXT,

    CONSTRAINT "WholesalerPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CapitalEntry_adminId_idx" ON "CapitalEntry"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Wholesaler_phone_key" ON "Wholesaler"("phone");

-- CreateIndex
CREATE INDEX "WholesalerPayment_wholesalerId_idx" ON "WholesalerPayment"("wholesalerId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_wholesalerId_fkey" FOREIGN KEY ("wholesalerId") REFERENCES "Wholesaler"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapitalEntry" ADD CONSTRAINT "CapitalEntry_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesalerPayment" ADD CONSTRAINT "WholesalerPayment_wholesalerId_fkey" FOREIGN KEY ("wholesalerId") REFERENCES "Wholesaler"("id") ON DELETE CASCADE ON UPDATE CASCADE;
