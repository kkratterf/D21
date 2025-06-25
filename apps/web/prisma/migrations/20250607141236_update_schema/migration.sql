/*
  Warnings:

  - You are about to drop the column `feature` on the `Directory` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `Directory` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Startup` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Startup` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Directory" DROP COLUMN "feature",
DROP COLUMN "visible",
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "featuredOrder" INTEGER;

-- AlterTable
ALTER TABLE "Startup" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL;
