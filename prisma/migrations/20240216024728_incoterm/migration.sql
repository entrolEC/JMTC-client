/*
  Warnings:

  - You are about to drop the `Incoterms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Incoterms";

-- CreateTable
CREATE TABLE "Incoterm" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Incoterm_pkey" PRIMARY KEY ("id")
);
