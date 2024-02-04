/*
  Warnings:

  - Added the required column `unitType` to the `QuoteItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuoteItem" ADD COLUMN     "unitType" TEXT NOT NULL;
