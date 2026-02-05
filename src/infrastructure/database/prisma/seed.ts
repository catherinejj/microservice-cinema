// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const movies = [
  {
    id: "movie_1",
    title: "Alien",
    description: "Un équipage spatial reçoit un signal de détresse et découvre une menace mortelle.",
    duration: 117,
    coverImage: undefined,
    category: "Sci-Fi",
    releaseDate: new Date("1979-05-25"),
    rating: 8.5,
  },
  {
    id: "movie_2",
    title: "Blade Runner",
    description: "Un chasseur de réplicants traque des androïdes dans un futur dystopique.",
    duration: 117,
    coverImage: undefined,
    category: "Sci-Fi",
    releaseDate: new Date("1982-06-25"),
    rating: 8.1,
  },
  {
    id: "movie_3",
    title: "Spirited Away",
    description: "Une jeune fille se retrouve dans un monde spirituel et doit sauver ses parents.",
    duration: 125,
    coverImage: undefined,
    category: "Animation",
    releaseDate: new Date("2001-07-20"),
    rating: 8.6,
  },
] as const;

  for (const m of movies) {
  await prisma.movie.upsert({
    where: { id: m.id },
    update: {
      title: m.title,
      description: m.description,
      duration: m.duration,
      coverImage: m.coverImage,
      category: m.category,
      releaseDate: m.releaseDate,
      rating: m.rating,
    },
    create: {
      id: m.id,
      title: m.title,
      description: m.description,
      duration: m.duration,
      coverImage: m.coverImage,
      category: m.category,
      releaseDate: m.releaseDate,
      rating: m.rating,
    },
  });
}
const movieById = new Map(movies.map((m) => [m.id, m]));

  const cinema = await prisma.cinema.upsert({
    where: { id: "cinema_1" },
    update: { name: "Cinéma Lumière", city: "Aix-en-Provence" },
    create: { id: "cinema_1", name: "Cinéma Lumière", city: "Aix-en-Provence" },
  });

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


  const seatsRoom1 = ["A", "B", "C"].flatMap((row) =>
    Array.from({ length: 10 }, (_, i) => ({
      roomId: room1.id,
      row,
      number: i + 1,
    })),
  );

  const seatsRoom2 = ["A", "B"].flatMap((row) =>
    Array.from({ length: 10 }, (_, i) => ({
      roomId: room2.id,
      row,
      number: i + 1,
    })),
  );

  await prisma.seat.createMany({ data: seatsRoom1, skipDuplicates: true });
  await prisma.seat.createMany({ data: seatsRoom2, skipDuplicates: true });

  const today = new Date();
  const baseDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

  function at(dayOffset: number, hour: number, minute: number) {
    return new Date(baseDay.getTime() + dayOffset * 24 * 60 * 60 * 1000 + (hour * 60 + minute) * 60 * 1000);
  }
  function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);}

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
  if (!movie) throw new Error(`Movie not found for screening ${s.id}: ${s.movieId}`);

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
    movies: movies.length,
    cinema: cinema.name,
    rooms: 2,
    seats: seatsRoom1.length + seatsRoom2.length,
    screenings: screenings.length,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });