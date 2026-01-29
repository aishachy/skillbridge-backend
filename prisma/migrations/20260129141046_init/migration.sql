/*
  Warnings:

  - A unique constraint covering the columns `[tutorId,startTime,endTime]` on the table `TutorAvailability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `TutorAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED');

-- AlterTable
ALTER TABLE "TutorAvailability" ADD COLUMN     "bookingId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TutorAvailability_tutorId_startTime_endTime_key" ON "TutorAvailability"("tutorId", "startTime", "endTime");

-- AddForeignKey
ALTER TABLE "TutorAvailability" ADD CONSTRAINT "TutorAvailability_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
