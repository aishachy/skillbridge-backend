/*
  Warnings:

  - You are about to drop the column `categoryId` on the `TutorProfiles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TutorProfiles" DROP CONSTRAINT "TutorProfiles_categoryId_fkey";

-- AlterTable
ALTER TABLE "TutorProfiles" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "_CategoriesToTutorProfiles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoriesToTutorProfiles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoriesToTutorProfiles_B_index" ON "_CategoriesToTutorProfiles"("B");

-- AddForeignKey
ALTER TABLE "_CategoriesToTutorProfiles" ADD CONSTRAINT "_CategoriesToTutorProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToTutorProfiles" ADD CONSTRAINT "_CategoriesToTutorProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "TutorProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
