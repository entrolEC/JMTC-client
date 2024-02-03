/*
  Warnings:

  - You are about to drop the column `currencyId` on the `Quote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_currencyId_fkey";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "currencyId";
