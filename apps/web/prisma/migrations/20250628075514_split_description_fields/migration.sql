/*
  Warnings:

  - You are about to drop the column `description` on the `Startup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "description",
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "shortDescription" TEXT;
