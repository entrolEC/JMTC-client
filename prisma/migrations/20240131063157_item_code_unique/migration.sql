/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");
