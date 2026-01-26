/*
  Warnings:

  - You are about to drop the column `adminEmail` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `emailNotifications` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpEmail` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpHost` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpPassword` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpPort` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "adminEmail",
DROP COLUMN "emailNotifications",
DROP COLUMN "smtpEmail",
DROP COLUMN "smtpHost",
DROP COLUMN "smtpPassword",
DROP COLUMN "smtpPort",
ADD COLUMN     "emailAdminReceiver" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailClientId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailClientSecret" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailGmailUser" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailRefreshToken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailSenderName" TEXT NOT NULL DEFAULT 'MKARIM Store';
