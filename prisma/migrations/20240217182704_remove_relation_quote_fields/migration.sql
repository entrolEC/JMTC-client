/*
  Warnings:

  - You are about to drop the column `dischargePortId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `loadingPortId` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `dischargePort` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "dischargePortId",
DROP COLUMN "loadingPortId",
ADD COLUMN     "dischargePort" TEXT NOT NULL;
