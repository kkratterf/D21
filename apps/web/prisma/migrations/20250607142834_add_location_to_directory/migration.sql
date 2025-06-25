/*
  Warnings:

  - You are about to drop the column `address` on the `Directory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Directory" DROP COLUMN "address",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION;
