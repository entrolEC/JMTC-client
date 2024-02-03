/*
  Warnings:

  - Added the required column `currency` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exchangeRate` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "exchangeRate" DOUBLE PRECISION NOT NULL;
