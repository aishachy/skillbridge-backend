/*
  Warnings:

  - You are about to drop the column `status` on the `Bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookings" DROP COLUMN "status";

-- DropEnum
DROP TYPE "STATUS";
