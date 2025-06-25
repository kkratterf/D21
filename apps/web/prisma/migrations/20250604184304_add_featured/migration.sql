-- AlterTable
ALTER TABLE "Directory" ADD COLUMN     "address" TEXT,
ADD COLUMN     "feature" BOOLEAN NOT NULL DEFAULT false;
