/*
  Warnings:

  - Made the column `shortDescription` on table `Startup` required. This step will fail if there are existing NULL values in that column.

*/
-- Update existing data to set a default value for shortDescription
UPDATE "Startup" SET "shortDescription" = 'Description not available' WHERE "shortDescription" IS NULL;

-- AlterTable
ALTER TABLE "Startup" ALTER COLUMN "shortDescription" SET NOT NULL;
