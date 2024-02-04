/*
  Warnings:

  - You are about to drop the column `count` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "count",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL DEFAULT 0;
