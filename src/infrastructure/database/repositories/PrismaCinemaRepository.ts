import { Injectable } from "@nestjs/common";
import type { ICinemaRepository } from "../../../domain/repositories/ICinemaRepository";
import { Cinema } from "../../../domain/entities/Cinema";
import { Room } from "../../../domain/entities/Room";
import { OpeningHours } from "../../../domain/entities/OpeningHours";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class PrismaCinemaRepository implements ICinemaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(cinema: Cinema): Promise<void> {
    if (!cinema.id) {
      throw new Error("PrismaCinemaRepository.create: cinema.id is required");
    }

    await this.prisma.cinema.create({
      data: {
        id: cinema.id,
        name: cinema.name,
        city: cinema.city ?? null,
      },
    });
  }

  async update(cinema: Cinema): Promise<void> {
    await this.prisma.cinema.update({
      where: { id: cinema.id },
      data: {
        name: cinema.name,
        city: cinema.city ?? null,
      },
    });
  }

  async findById(id: string): Promise<Cinema | null> {
    const row = await this.prisma.cinema.findUnique({
      where: { id },
      include: {
        rooms: true,
        openingHours: true,
      },
    });

    if (!row) return null;

    return this.toDomain(row);
  }

  async list(): Promise<Cinema[]> {
    const rows = await this.prisma.cinema.findMany({
      orderBy: { name: "asc" },
      include: {
        rooms: true,
        openingHours: true,
      },
    });

    return rows.map((r) => this.toDomain(r));
  }

  // -------------------------
  // Mapping Prisma -> Domain
  // -------------------------
  private toDomain(row: any): Cinema {
    const rooms: Room[] = (row.rooms ?? []).map((r: any) =>
      Room.create({
        id: r.id,
        cinemaId: r.cinemaId,
        name: r.name,
        capacitySeat: r.capacitySeat,
        seats: [],
        screenings: [],
      }),
    );

    const openingHours: OpeningHours[] = (row.openingHours ?? []).map((h: any) =>
      OpeningHours.create({
        id: h.id,
        cinemaId: h.cinemaId,
        day: h.day,
        openTime: h.openTime,
        closeTime: h.closeTime,
        isClosed: h.isClosed,
      }),
    );

    return Cinema.create({
      id: row.id,
      name: row.name,
      city: row.city ?? undefined,
      rooms,
      openingHours,
    });
  }
}