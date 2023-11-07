/*
  Warnings:

  - You are about to drop the `_userCart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_userCart" DROP CONSTRAINT "_userCart_A_fkey";

-- DropForeignKey
ALTER TABLE "_userCart" DROP CONSTRAINT "_userCart_B_fkey";

-- DropForeignKey
ALTER TABLE "_userFavorites" DROP CONSTRAINT "_userFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_userFavorites" DROP CONSTRAINT "_userFavorites_B_fkey";

-- DropTable
DROP TABLE "_userCart";

-- DropTable
DROP TABLE "_userFavorites";

-- CreateTable
CREATE TABLE "_ClientToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_favorites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToProduct_AB_unique" ON "_ClientToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToProduct_B_index" ON "_ClientToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_favorites_AB_unique" ON "_favorites"("A", "B");

-- CreateIndex
CREATE INDEX "_favorites_B_index" ON "_favorites"("B");

-- AddForeignKey
ALTER TABLE "_ClientToProduct" ADD CONSTRAINT "_ClientToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToProduct" ADD CONSTRAINT "_ClientToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorites" ADD CONSTRAINT "_favorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorites" ADD CONSTRAINT "_favorites_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
