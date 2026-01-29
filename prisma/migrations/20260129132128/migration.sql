/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reviews_bookingId_key" ON "Reviews"("bookingId");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
