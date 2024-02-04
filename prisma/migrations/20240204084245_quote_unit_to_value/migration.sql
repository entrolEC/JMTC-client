/*
  Warnings:

  - You are about to drop the column `value` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `value` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "value";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "unit",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
