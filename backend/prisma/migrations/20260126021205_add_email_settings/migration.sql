-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "adminEmail" TEXT,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smtpEmail" TEXT,
ADD COLUMN     "smtpHost" TEXT,
ADD COLUMN     "smtpPassword" TEXT,
ADD COLUMN     "smtpPort" INTEGER NOT NULL DEFAULT 587;
