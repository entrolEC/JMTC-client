/*
  Warnings:

  - Added the required column `count` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyType` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exchangeRate` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `QuoteItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "count" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "currencyType" TEXT NOT NULL,
ADD COLUMN     "exchangeRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "volume" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "QuoteItem" ADD COLUMN     "price" INTEGER NOT NULL;
