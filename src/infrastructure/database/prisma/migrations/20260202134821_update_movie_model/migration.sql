/*
  Warnings:

  - You are about to drop the column `durationMinutes` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAtSource` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,releaseDate]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "durationMinutes",
DROP COLUMN "updatedAtSource",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_title_releaseDate_key" ON "Movie"("title", "releaseDate");
