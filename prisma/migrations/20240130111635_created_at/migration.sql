/*
  Warnings:

  - Added the required column `createdAt` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;
