/*
  Warnings:

  - Added the required column `capacitySeat` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "capacitySeat" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OpeningHours" (
    "id" TEXT NOT NULL,
    "cinemaId" TEXT NOT NULL,
    "day" "Weekday" NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OpeningHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screening" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "extraMinutes" INTEGER DEFAULT 0,
    "basePrice" DECIMAL(5,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Screening_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpeningHours_cinemaId_idx" ON "OpeningHours"("cinemaId");

-- CreateIndex
CREATE UNIQUE INDEX "OpeningHours_cinemaId_day_key" ON "OpeningHours"("cinemaId", "day");

-- CreateIndex
CREATE INDEX "Screening_movieId_idx" ON "Screening"("movieId");

-- CreateIndex
CREATE INDEX "Screening_startsAt_idx" ON "Screening"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Screening_roomId_startsAt_key" ON "Screening"("roomId", "startsAt");

-- AddForeignKey
ALTER TABLE "OpeningHours" ADD CONSTRAINT "OpeningHours_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
