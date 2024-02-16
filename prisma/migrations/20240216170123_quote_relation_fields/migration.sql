/*
  Warnings:

  - Added the required column `ctnrId` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dischargePortId` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incotermId` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loadingPortId` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "ctnrId" TEXT NOT NULL,
ADD COLUMN     "dischargePortId" TEXT NOT NULL,
ADD COLUMN     "incotermId" TEXT NOT NULL,
ADD COLUMN     "loadingPortId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_loadingPortId_fkey" FOREIGN KEY ("loadingPortId") REFERENCES "Port"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_dischargePortId_fkey" FOREIGN KEY ("dischargePortId") REFERENCES "Port"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_incotermId_fkey" FOREIGN KEY ("incotermId") REFERENCES "Incoterm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_ctnrId_fkey" FOREIGN KEY ("ctnrId") REFERENCES "Ctnr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
