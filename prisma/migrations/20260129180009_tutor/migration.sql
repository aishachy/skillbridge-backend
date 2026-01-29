/*
  Warnings:

  - You are about to drop the `_CategoriesToTutorProfiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoriesToTutorProfiles" DROP CONSTRAINT "_CategoriesToTutorProfiles_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriesToTutorProfiles" DROP CONSTRAINT "_CategoriesToTutorProfiles_B_fkey";

-- AlterTable
ALTER TABLE "TutorProfiles" ADD COLUMN     "categoryId" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "_CategoriesToTutorProfiles";

-- AddForeignKey
ALTER TABLE "TutorProfiles" ADD CONSTRAINT "TutorProfiles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
