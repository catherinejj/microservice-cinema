// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

type SeedMovie = {
  id: string;
  title: string;
  duration: number; // minutes
  posterUrl?: string;
};

async function main() {
  /**
   * IMPORTANT :
   * On garde une liste locale "movies" uniquement pour calculer endsAt.
   * On ne crée plus de table Movie => aucun prisma.movie ici.
   */
  const movies: SeedMovie[] = [
    { id: "movie_1", title: "Alien", duration: 117 },
    { id: "movie_2", title: "Blade Runner", duration: 117 },
    { id: "movie_3", title: "Spirited Away", duration: 125 },
  ];

  const movieById = new Map(movies.map((m) => [m.id, m] as const));

  // -------------------------
  // CINEMA
  // -------------------------
  const cinema = await prisma.cinema.upsert({
    where: { id: "cinema_1" },
    update: {
      name: "Cinéma Lumière",
      city: "Aix-en-Provence",
      address: "1 rue des Films",
      zipCode: "13100",
      phoneNumber: "+33 4 00 00 00 00",
    },
    create: {
      id: "cinema_1",
      name: "Cinéma Lumière",
      city: "Aix-en-Provence",
      address: "1 rue des Films",
      zipCode: "13100",
      phoneNumber: "+33 4 00 00 00 00",
    },
  });

  // -------------------------
  // OPENING HOURS
  // -------------------------
  const openingHours = [
    { day: "MON", openTime: "10:00", closeTime: "23:00", isClosed: false },
    { day: "TUE", openTime: "10:00", closeTime: "23:00", isClosed: false },
    { day: "WED", openTime: "10:00", closeTime: "23:00", isClosed: false },
    { day: "THU", openTime: "10:00", closeTime: "23:00", isClosed: false },
    { day: "FRI", openTime: "10:00", closeTime: "00:30", isClosed: false },
    { day: "SAT", openTime: "10:00", closeTime: "00:30", isClosed: false },
    { day: "SUN", openTime: "10:00", closeTime: "22:00", isClosed: false },
  ] as const;

  for (const oh of openingHours) {
    await prisma.openingHours.upsert({
      where: {
        cinemaId_day: { cinemaId: cinema.id, day: oh.day },
      },
      update: {
        openTime: oh.openTime,
        closeTime: oh.closeTime,
        isClosed: oh.isClosed,
      },
      create: {
        cinemaId: cinema.id,
        day: oh.day,
        openTime: oh.openTime,
        closeTime: oh.closeTime,
        isClosed: oh.isClosed,
      },
    });
  }

  // -------------------------
  // ROOMS
  // -------------------------
  const room1 = await prisma.room.upsert({
    where: { id: "room_1" },
    update: { name: "Salle 1", cinemaId: cinema.id, capacitySeat: 30 },
    create: { id: "room_1", name: "Salle 1", cinemaId: cinema.id, capacitySeat: 30 },
  });

  const room2 = await prisma.room.upsert({
    where: { id: "room_2" },
    update: { name: "Salle 2", cinemaId: cinema.id, capacitySeat: 20 },
    create: { id: "room_2", name: "Salle 2", cinemaId: cinema.id, capacitySeat: 20 },
  });

  // -------------------------
  // SEATS
  // -------------------------
  const seatsRoom1 = ["A", "B", "C"].flatMap((row) =>
    Array.from({ length: 10 }, (_, i) => ({
      roomId: room1.id,
      row,
      number: i + 1,
    }))
  );

  const seatsRoom2 = ["A", "B"].flatMap((row) =>
    Array.from({ length: 10 }, (_, i) => ({
      roomId: room2.id,
      row,
      number: i + 1,
    }))
  );

  await prisma.seat.createMany({ data: seatsRoom1, skipDuplicates: true });
  await prisma.seat.createMany({ data: seatsRoom2, skipDuplicates: true });

  // -------------------------
  // SCREENINGS
  // -------------------------
  const today = new Date();
  const baseDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

  function at(dayOffset: number, hour: number, minute: number) {
    return new Date(
      baseDay.getTime() +
        dayOffset * 24 * 60 * 60 * 1000 +
        (hour * 60 + minute) * 60 * 1000
    );
  }

  function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60_000);
  }

  const screenings = [
    {
      id: "scr_1",
      roomId: room1.id,
      movieId: "movie_1",
      startsAt: at(0, 14, 0),
      extraMinutes: 10,
      basePrice: "9.50",
      currency: "EUR",
    },
    {
      id: "scr_2",
      roomId: room1.id,
      movieId: "movie_2",
      startsAt: at(0, 18, 0),
      extraMinutes: 10,
      basePrice: "11.00",
      currency: "EUR",
    },
    {
      id: "scr_3",
      roomId: room2.id,
      movieId: "movie_3",
      startsAt: at(1, 16, 0),
      extraMinutes: 10,
      basePrice: "8.00",
      currency: "EUR",
    },
  ] as const;

  for (const s of screenings) {
    const movie = movieById.get(s.movieId);
    if (!movie) {
      throw new Error(`Seed: movie not found for screening ${s.id}: ${s.movieId}`);
    }

    const endsAt = addMinutes(s.startsAt, movie.duration + (s.extraMinutes ?? 0));

    await prisma.screening.upsert({
      where: { id: s.id },
      update: {
        roomId: s.roomId,
        movieId: s.movieId,
        startsAt: s.startsAt,
        endsAt,
        extraMinutes: s.extraMinutes,
        basePrice: s.basePrice as any,
        currency: s.currency,
      },
      create: {
        id: s.id,
        roomId: s.roomId,
        movieId: s.movieId,
        startsAt: s.startsAt,
        endsAt,
        extraMinutes: s.extraMinutes,
        basePrice: s.basePrice as any,
        currency: s.currency,
      },
    });
  }

  console.log("✅ Seed terminé :", {
    cinema: { id: cinema.id, name: cinema.name },
    rooms: 2,
    seats: seatsRoom1.length + seatsRoom2.length,
    screenings: screenings.length,
    note: "Movies are external (not stored in this DB).",
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });