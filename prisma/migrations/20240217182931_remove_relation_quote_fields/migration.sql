/*
  Warnings:

  - You are about to drop the column `ctnrId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `incotermId` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "ctnrId",
DROP COLUMN "incotermId";
