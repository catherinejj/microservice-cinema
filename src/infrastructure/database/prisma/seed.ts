// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  // IDs réels du service movie-cinema.la4.fr
  const movies: SeedMovie[] = [
    { id: "cmm0emqmj000028ocnm52ie1e", title: "Inception", duration: 148 },
    { id: "cmm0emqnu000228ocmqii59jw", title: "The Dark Knight", duration: 152 },
    { id: "cmm0emqnn000128oc8vbyu8m9", title: "The Godfather", duration: 175 },
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

  // Salle complet (capacitySeat = 0) pour tester le filtre hasAvailableSeats
  const room3 = await prisma.room.upsert({
    where: { id: "room_3" },
    update: { name: "Salle 3 (complet)", cinemaId: cinema.id, capacitySeat: 0 },
    create: { id: "room_3", name: "Salle 3 (complet)", cinemaId: cinema.id, capacitySeat: 0 },
  });

  // -------------------------
  // CINEMA 2 — Paris (pour tester cityName)
  // -------------------------
  const cinema2 = await prisma.cinema.upsert({
    where: { id: "cinema_2" },
    update: {
      name: "Cinéma Étoile",
      city: "Paris",
      address: "10 avenue des Champs-Élysées",
      zipCode: "75008",
      phoneNumber: "+33 1 00 00 00 00",
    },
    create: {
      id: "cinema_2",
      name: "Cinéma Étoile",
      city: "Paris",
      address: "10 avenue des Champs-Élysées",
      zipCode: "75008",
      phoneNumber: "+33 1 00 00 00 00",
    },
  });

  const openingHours2 = [
    { day: "MON", openTime: "10:00", closeTime: "23:00", isClosed: false },
    { day: "TUE", openTime: "10:00", closeTime: "23:00", isClosed: false },
    { day: "WED", openTime: "10:00", closeTime: "23:00", isClosed: false },
    { day: "THU", openTime: "10:00", closeTime: "23:00", isClosed: false },
    { day: "FRI", openTime: "10:00", closeTime: "00:30", isClosed: false },
    { day: "SAT", openTime: "10:00", closeTime: "00:30", isClosed: false },
    { day: "SUN", openTime: "10:00", closeTime: "22:00", isClosed: false },
  ] as const;

  for (const oh of openingHours2) {
    await prisma.openingHours.upsert({
      where: { cinemaId_day: { cinemaId: cinema2.id, day: oh.day } },
      update: { openTime: oh.openTime, closeTime: oh.closeTime, isClosed: oh.isClosed },
      create: { cinemaId: cinema2.id, day: oh.day, openTime: oh.openTime, closeTime: oh.closeTime, isClosed: oh.isClosed },
    });
  }

  const room4 = await prisma.room.upsert({
    where: { id: "room_4" },
    update: { name: "Grande Salle", cinemaId: cinema2.id, capacitySeat: 50 },
    create: { id: "room_4", name: "Grande Salle", cinemaId: cinema2.id, capacitySeat: 50 },
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
      // Inception — Salle 1 — places disponibles (capacitySeat: 30)
      id: "scr_1",
      roomId: room1.id,
      movieId: "cmm0emqmj000028ocnm52ie1e",
      startsAt: at(1, 14, 0),
      extraMinutes: 10,
      basePrice: "10.50",
      currency: "EUR",
    },
    {
      // The Dark Knight — Salle 2 — places disponibles (capacitySeat: 20)
      id: "scr_2",
      roomId: room2.id,
      movieId: "cmm0emqnu000228ocmqii59jw",
      startsAt: at(1, 18, 0),
      extraMinutes: 10,
      basePrice: "11.00",
      currency: "EUR",
    },
    {
      // The Godfather — Salle 1 — places disponibles (capacitySeat: 30)
      id: "scr_3",
      roomId: room1.id,
      movieId: "cmm0emqnn000128oc8vbyu8m9",
      startsAt: at(2, 16, 0),
      extraMinutes: 10,
      basePrice: "9.00",
      currency: "EUR",
    },
    {
      // The Godfather — Salle 3 COMPLET — pour tester hasAvailableSeats=false (capacitySeat: 0)
      id: "scr_4",
      roomId: room3.id,
      movieId: "cmm0emqnn000128oc8vbyu8m9",
      startsAt: at(2, 20, 0),
      extraMinutes: 10,
      basePrice: "8.00",
      currency: "EUR",
    },
    // --- Cinéma Étoile (Paris) — pour tester cityName=Paris, cinemaId, priceMax ---
    {
      // Inception — Paris — matin (10h UTC) — prix bas pour tester priceMax
      id: "scr_5",
      roomId: room4.id,
      movieId: "cmm0emqmj000028ocnm52ie1e",
      startsAt: at(1, 9, 0),   // 9h UTC = 10h CET (morning)
      extraMinutes: 10,
      basePrice: "7.50",
      currency: "EUR",
    },
    {
      // The Dark Knight — Paris — après-midi (14h UTC) — prix moyen
      id: "scr_6",
      roomId: room4.id,
      movieId: "cmm0emqnu000228ocmqii59jw",
      startsAt: at(1, 14, 0),  // 14h UTC = 15h CET (afternoon)
      extraMinutes: 10,
      basePrice: "9.50",
      currency: "EUR",
    },
    {
      // The Godfather — Paris — soir (18h UTC) — prix élevé
      id: "scr_7",
      roomId: room4.id,
      movieId: "cmm0emqnn000128oc8vbyu8m9",
      startsAt: at(2, 18, 0),  // 18h UTC = 19h CET (evening)
      extraMinutes: 10,
      basePrice: "13.00",
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
    cinemas: 2,
    rooms: 4,
    seats: seatsRoom1.length + seatsRoom2.length,
    screenings: screenings.length,
    note: "Movies are external (not stored in this DB). IDs from movie-cinema.la4.fr",
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
