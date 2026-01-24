-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "categoriesSubtitle" TEXT NOT NULL DEFAULT 'Découvrez notre large gamme de produits par univers.',
ADD COLUMN     "categoriesTitle" TEXT NOT NULL DEFAULT 'NOS CATÉGORIES',
ADD COLUMN     "ctaPrimaryBtnLink" TEXT NOT NULL DEFAULT '/products',
ADD COLUMN     "ctaPrimaryBtnText" TEXT NOT NULL DEFAULT 'Accéder à la Boutique',
ADD COLUMN     "ctaSecondaryBtnLink" TEXT NOT NULL DEFAULT '/contact',
ADD COLUMN     "ctaSecondaryBtnText" TEXT NOT NULL DEFAULT 'Besoin d''aide ?',
ADD COLUMN     "ctaSubtitle" TEXT NOT NULL DEFAULT 'Rejoignez l''élite des gamers marocains. Qualité certifiée, livraison express et service client dédié.',
ADD COLUMN     "ctaTitle" TEXT NOT NULL DEFAULT 'PRÊT À RÉVOLUTIONNER VOTRE SETUP ?',
ADD COLUMN     "facebookLink" TEXT,
ADD COLUMN     "featuredSubtitle" TEXT NOT NULL DEFAULT 'Les meilleures ventes et nouveautés sélectionnées pour vous.',
ADD COLUMN     "featuredTitle" TEXT NOT NULL DEFAULT 'PRODUITS POPULAIRES',
ADD COLUMN     "instagramLink" TEXT,
ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "tiktokLink" TEXT,
ADD COLUMN     "twitterLink" TEXT,
ADD COLUMN     "whySubtitle" TEXT NOT NULL DEFAULT 'Nous redéfinissons le standard du gaming au Maroc avec un service irréprochable.',
ADD COLUMN     "whyTitle" TEXT NOT NULL DEFAULT 'L''EXCELLENCE MKARIM SOLUTION',
ADD COLUMN     "youtubeLink" TEXT;

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "buttonText" TEXT NOT NULL DEFAULT 'Commander Maintenant',
    "buttonLink" TEXT NOT NULL DEFAULT '/products',
    "badge" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);
