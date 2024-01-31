/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_userId_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "imageUrl",
ADD COLUMN     "image_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "customerId",
DROP COLUMN "userId",
ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT;

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "writer" TEXT NOT NULL,
    "manager" TEXT NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "quote_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("quote_id","item_id")
);

-- CreateTable
CREATE TABLE "_ItemToQuote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToQuote_AB_unique" ON "_ItemToQuote"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToQuote_B_index" ON "_ItemToQuote"("B");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToQuote" ADD CONSTRAINT "_ItemToQuote_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToQuote" ADD CONSTRAINT "_ItemToQuote_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
