/*
  Warnings:

  - You are about to drop the column `item_id` on the `QuoteItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuoteItem" DROP CONSTRAINT "QuoteItem_item_id_fkey";

-- AlterTable
ALTER TABLE "QuoteItem" DROP COLUMN "item_id";
