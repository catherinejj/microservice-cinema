import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("Screenings (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let roomId: string;

  beforeAll(async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    moduleBuilder.overrideProvider("IMovieCatalog").useValue({
      getSummary: jest.fn().mockResolvedValue({
        id: "movie_e2e_1",
        title: "E2E Movie",
        duration: 120,
        posterUrl: null,
      }),
    });

    const moduleFixture: TestingModule = await moduleBuilder.compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    const cinema = await prisma.cinema.create({
      data: {
        name: "Cinema E2E",
        city: "Paris",
      },
      select: { id: true },
    });

    const room = await prisma.room.create({
      data: {
        cinemaId: cinema.id,
        name: "Room E2E",
        capacitySeat: 80,
      },
      select: { id: true },
    });

    roomId = room.id;
  });

  afterAll(async () => {
    await prisma.screening.deleteMany({
      where: { roomId },
    });
    await prisma.room.deleteMany({
      where: { id: roomId },
    });
    await prisma.cinema.deleteMany({
      where: { name: "Cinema E2E" },
    });
    await app.close();
  });

  it("POST /screenings then GET /screenings/:id persists extraMinutes and price", async () => {
    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const payload = {
      movieId: "movie_e2e_1",
      roomId,
      startsAt,
      extraMinutes: 9,
      basePrice: 10.75,
      currency: "EUR",
    };

    const postRes = await request(app.getHttpServer())
      .post("/screenings")
      .send(payload)
      .expect(201);

    expect(postRes.body.id).toBeDefined();
    const screeningId = postRes.body.id as string;

    const getRes = await request(app.getHttpServer())
      .get(`/screenings/${screeningId}`)
      .expect(200);

    expect(getRes.body.extraMinutes).toBe(9);
    expect(getRes.body.price?.amount).toBe("10.75");
    expect(getRes.body.price?.currency).toBe("EUR");

    const dbRow = await prisma.screening.findUnique({
      where: { id: screeningId },
      select: {
        extraMinutes: true,
        basePrice: true,
      },
    });

    expect(dbRow).not.toBeNull();
    expect(dbRow?.extraMinutes).toBe(9);
    expect(Number(dbRow?.basePrice)).toBe(10.75);
  });
});
