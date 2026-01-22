-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "storeName" TEXT NOT NULL DEFAULT 'MKARIM',
    "storeAvailability" BOOLEAN NOT NULL DEFAULT true,
    "codEnabled" BOOLEAN NOT NULL DEFAULT true,
    "whatsappNumber" TEXT NOT NULL DEFAULT '+212600000000',
    "currency" TEXT NOT NULL DEFAULT 'DH',
    "contactAddress" TEXT NOT NULL DEFAULT 'Casablanca, Maroc',
    "contactPhone" TEXT NOT NULL DEFAULT '+212600000000',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@mkarim.ma',
    "contactHours" TEXT NOT NULL DEFAULT 'Lun - Sam: 9h - 19h',
    "footerDescription" TEXT NOT NULL DEFAULT 'Votre destination pour les meilleurs PC et accessoires gaming au Maroc. Qualité garantie, livraison rapide.',
    "footerCopyright" TEXT NOT NULL DEFAULT '© 2024 MKARIM. Tous droits réservés.',
    "aboutTitle" TEXT NOT NULL DEFAULT 'À Propos de MKARIM',
    "aboutDescription" TEXT NOT NULL DEFAULT 'MKARIM est votre partenaire de confiance pour tous vos besoins en matériel informatique et gaming au Maroc.',
    "aboutMission" TEXT NOT NULL DEFAULT 'Notre mission est de fournir des produits de haute qualité à des prix compétitifs avec un service client exceptionnel.',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
