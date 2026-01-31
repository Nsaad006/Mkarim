-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "categoriesAutoPlayInterval" INTEGER NOT NULL DEFAULT 3000,
ADD COLUMN     "homeHeroAutoPlayInterval" INTEGER NOT NULL DEFAULT 5000;
