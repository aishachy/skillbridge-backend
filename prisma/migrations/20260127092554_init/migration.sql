/*
  Warnings:

  - You are about to alter the column `bio` on the `TutorProfiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(225)`.

*/
-- AlterTable
ALTER TABLE "TutorProfiles" ALTER COLUMN "bio" SET DATA TYPE VARCHAR(225);
