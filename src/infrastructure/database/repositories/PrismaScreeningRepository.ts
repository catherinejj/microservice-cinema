import { Injectable } from "@nestjs/common";
import type { IScreeningRepository } from "../../../domain/repositories";
import { ScreeningFilters } from "../../../domain/repositories/IScreeningRepository";
import { Screening } from "../../../domain/entities/Screening";
import { TimeRange } from "../../../domain/value-objects/TimeRange";
import { Money } from "../../../domain/value-objects/Money";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class PrismaScreeningRepository implements IScreeningRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(screening: Screening): Promise<string> {
    const created = await this.prisma.screening.create({
      data: {
        // Prisma génère l'id si tu ne le fournis pas
        // MAIS toi tu le génères via cuid() dans l'use-case, donc on peut l'envoyer.
        id: screening.id,
        roomId: screening.roomId,
        movieId: screening.movieId,
        startsAt: screening.slot.start,
        endsAt: screening.slot.end,
        basePrice: screening.price.amount as any,
        currency: screening.price.currency,
        extraMinutes: screening.extraMinutes,
      },
      select: { id: true },
    });

    return created.id;
  }

  async update(screening: Screening): Promise<void> {
    if (!screening.id) throw new Error("PrismaScreeningRepository.update: screening.id is required");

    await this.prisma.screening.update({
      where: { id: screening.id },
      data: {
        roomId: screening.roomId,
        movieId: screening.movieId,
        startsAt: screening.slot.start,
        endsAt: screening.slot.end,
        basePrice: screening.price.amount as any,
        currency: screening.price.currency,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.screening.delete({ where: { id } });
  }

  async findById(id: string): Promise<Screening | null> {
    const row = await this.prisma.screening.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async listByRoomId(roomId: string, from?: Date, to?: Date): Promise<Screening[]> {
    const rows = await this.prisma.screening.findMany({
      where: {
        roomId,
        ...(from || to
          ? {
              startsAt: from ? { gte: from } : undefined,
              endsAt: to ? { lte: to } : undefined,
            }
          : {}),
      },
      orderBy: { startsAt: "asc" },
    });

    return rows.map((r) => this.toDomain(r));
  }

  async hasOverlap(roomId: string, slot: TimeRange, excludeScreeningId?: string): Promise<boolean> {
    const found = await this.prisma.screening.findFirst({
      where: {
        roomId,
        ...(excludeScreeningId ? { id: { not: excludeScreeningId } } : {}),
        startsAt: { lt: slot.end },
        endsAt: { gt: slot.start },
      },
      select: { id: true },
    });

    return !!found;
  }
  async findAll(filters?: ScreeningFilters): Promise<Screening[]> {
    const rows = await this.prisma.screening.findMany({
      where: this.buildWhereClause(undefined, filters),
      orderBy: this.buildOrderByClause(filters),
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findByMovieId(movieId: string, filters?: ScreeningFilters): Promise<Screening[]> {
    const rows = await this.prisma.screening.findMany({
      where: this.buildWhereClause(movieId, filters),
      orderBy: this.buildOrderByClause(filters),
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findMovieIdsByCinemaId(cinemaId: string): Promise<string[]> {
    const rows = await this.prisma.screening.findMany({
      where: {
        room: {
          cinemaId,
        },
      },
      select: { movieId: true },
      distinct: ["movieId"],
    });

    return rows.map((r) => r.movieId);
  }
  
  private buildWhereClause(movieId?: string, filters?: ScreeningFilters) {
    const where: any = {};

    if (movieId) where.movieId = movieId;

    // Filtres de date sur startsAt
    if (filters?.fromDate || filters?.toDate) {
      where.startsAt = {};
      if (filters.fromDate) where.startsAt.gte = filters.fromDate;
      if (filters.toDate) where.startsAt.lte = filters.toDate;
    }

    // Prix maximum (basePrice est en décimal ex: 10.50)
    if (filters?.priceMax !== undefined) {
      where.basePrice = { lte: filters.priceMax };
    }

    // Filtres liés à la room et au cinéma (mergés dans un seul objet room)
    const roomFilter: any = {};

    if (filters?.hasAvailableSeats === true) {
      roomFilter.capacitySeat = { gt: 0 };
    } else if (filters?.hasAvailableSeats === false) {
      roomFilter.capacitySeat = { equals: 0 };
    }

    const cinemaFilter: any = {};
    if (filters?.cinemaId) cinemaFilter.id = filters.cinemaId;
    if (filters?.cityName) {
      cinemaFilter.city = { contains: filters.cityName, mode: "insensitive" };
    }
    if (Object.keys(cinemaFilter).length > 0) {
      roomFilter.cinema = cinemaFilter;
    }

    if (Object.keys(roomFilter).length > 0) {
      where.room = roomFilter;
    }

    return where;
  }

  /** Tri : startsAt (défaut) ou basePrice */
  private buildOrderByClause(filters?: ScreeningFilters) {
    const order = filters?.sortOrder ?? "asc";
    if (filters?.sortBy === "price") return { basePrice: order };
    return { startsAt: order };
  }

  private toDomain(row: {
    id: string;
    roomId: string;
    movieId: string;
    startsAt: Date;
    endsAt: Date;
    extraMinutes: number | null;
    basePrice: any;
    currency: string;
  }): Screening {
    const slot = TimeRange.of(row.startsAt, row.endsAt);
    const price = Money.fromDecimal(Number(row.basePrice), row.currency);

    return Screening.create({
      id: row.id,
      roomId: row.roomId,
      movieId: row.movieId,
      slot,
      price,
      extraMinutes: row.extraMinutes ?? 0,
    });
  }
}
