-- DropForeignKey
ALTER TABLE "Procurement" DROP CONSTRAINT "Procurement_productId_fkey";

-- AddForeignKey
ALTER TABLE "Procurement" ADD CONSTRAINT "Procurement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
