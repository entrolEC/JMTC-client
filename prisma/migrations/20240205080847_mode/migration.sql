-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "grossWeight" DOUBLE PRECISION,
ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'ocean';
