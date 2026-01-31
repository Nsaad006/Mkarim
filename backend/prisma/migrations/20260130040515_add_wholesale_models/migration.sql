/*
  Warnings:

  - You are about to drop the column `wholesalerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Wholesaler` table. All the data in the column will be lost.
  - You are about to drop the column `contactPerson` on the `Wholesaler` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Wholesaler` table. All the data in the column will be lost.
  - You are about to drop the `WholesalerPayment` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `address` on table `Wholesaler` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "WholesaleStatus" AS ENUM ('PENDING', 'PAID');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_wholesalerId_fkey";

-- DropForeignKey
ALTER TABLE "WholesalerPayment" DROP CONSTRAINT "WholesalerPayment_wholesalerId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "wholesalerId";

-- AlterTable
ALTER TABLE "Wholesaler" DROP COLUMN "companyName",
DROP COLUMN "contactPerson",
DROP COLUMN "notes",
ALTER COLUMN "address" SET NOT NULL;

-- DropTable
DROP TABLE "WholesalerPayment";

-- CreateTable
CREATE TABLE "WholesaleOrder" (
    "id" TEXT NOT NULL,
    "wholesalerId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "advanceAmount" INTEGER NOT NULL DEFAULT 0,
    "status" "WholesaleStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WholesaleOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesaleOrderItem" (
    "id" TEXT NOT NULL,
    "wholesaleOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,

    CONSTRAINT "WholesaleOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WholesaleOrder_orderNumber_key" ON "WholesaleOrder"("orderNumber");

-- AddForeignKey
ALTER TABLE "WholesaleOrder" ADD CONSTRAINT "WholesaleOrder_wholesalerId_fkey" FOREIGN KEY ("wholesalerId") REFERENCES "Wholesaler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleOrderItem" ADD CONSTRAINT "WholesaleOrderItem_wholesaleOrderId_fkey" FOREIGN KEY ("wholesaleOrderId") REFERENCES "WholesaleOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WholesaleOrderItem" ADD CONSTRAINT "WholesaleOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
