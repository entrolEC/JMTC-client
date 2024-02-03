/*
  Warnings:

  - You are about to drop the column `currencyType` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeRate` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `currencyId` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "currencyType",
DROP COLUMN "exchangeRate",
ADD COLUMN     "currencyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
