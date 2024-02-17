/*
  Warnings:

  - Added the required column `ctnr` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incoterm` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loadingPort` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_ctnrId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_dischargePortId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_incotermId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_loadingPortId_fkey";

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "ctnr" TEXT NOT NULL,
ADD COLUMN     "incoterm" TEXT NOT NULL,
ADD COLUMN     "loadingPort" TEXT NOT NULL;
