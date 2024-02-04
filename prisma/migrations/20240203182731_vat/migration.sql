/*
  Warnings:

  - You are about to drop the column `unit` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `gWeight` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "unit",
ADD COLUMN     "unitType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "vat" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "gWeight",
ADD COLUMN     "unit" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "QuoteItem" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "vat" DOUBLE PRECISION NOT NULL DEFAULT 0;
