/*
  Warnings:

  - The primary key for the `TutorProfiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TutorProfiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `_CategoriesToTutorProfiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `studentId` on the `Bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tutorId` on the `Bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `studentId` on the `Reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tutorId` on the `Reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `bookingId` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tutorId` on the `TutorAvailability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `TutorProfiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_CategoriesToTutorProfiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Bookings" DROP CONSTRAINT "Bookings_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Bookings" DROP CONSTRAINT "Bookings_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "TutorAvailability" DROP CONSTRAINT "TutorAvailability_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "TutorProfiles" DROP CONSTRAINT "TutorProfiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriesToTutorProfiles" DROP CONSTRAINT "_CategoriesToTutorProfiles_B_fkey";

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL,
DROP COLUMN "tutorId",
ADD COLUMN     "tutorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL,
DROP COLUMN "tutorId",
ADD COLUMN     "tutorId" INTEGER NOT NULL,
DROP COLUMN "bookingId",
ADD COLUMN     "bookingId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TutorAvailability" DROP COLUMN "tutorId",
ADD COLUMN     "tutorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TutorProfiles" DROP CONSTRAINT "TutorProfiles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "TutorProfiles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_CategoriesToTutorProfiles" DROP CONSTRAINT "_CategoriesToTutorProfiles_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_CategoriesToTutorProfiles_AB_pkey" PRIMARY KEY ("A", "B");

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "verification";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "ROLE" NOT NULL DEFAULT 'STUDENT',
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TutorProfiles_userId_key" ON "TutorProfiles"("userId");

-- CreateIndex
CREATE INDEX "_CategoriesToTutorProfiles_B_index" ON "_CategoriesToTutorProfiles"("B");

-- AddForeignKey
ALTER TABLE "TutorProfiles" ADD CONSTRAINT "TutorProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "TutorProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "TutorProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorAvailability" ADD CONSTRAINT "TutorAvailability_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "TutorProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToTutorProfiles" ADD CONSTRAINT "_CategoriesToTutorProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "TutorProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
