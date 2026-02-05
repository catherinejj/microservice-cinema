import { Injectable } from "@nestjs/common";
import type { IScreeningRepository } from "../../../domain/repositories";
import { Screening } from "../../../domain/entities/Screening";
import { TimeRange } from "../../../domain/value-objects/TimeRange";
import { Money } from "../../../domain/value-objects/Money";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class PrismaScreeningRepository implements IScreeningRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(screening: Screening): Promise<void> {
    await this.prisma.screening.create({
      data: {
        id: screening.id,
        roomId: screening.roomId,
        movieId: screening.movieId,

        startsAt: screening.slot.start,
        endsAt: screening.slot.end,

        // entity ne stocke pas extraMinutes => on met 0 par défaut
        extraMinutes: 0,

        // Prisma Decimal: on stocke le montant en euros (ex: 9.50)
        basePrice: screening.price.amount as any,
        currency: screening.price.currency,
      },
    });
  }

  async update(screening: Screening): Promise<void> {
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

  async findById(id: string): Promise<Screening | null> {
    const row = await this.prisma.screening.findUnique({
      where: { id },
    });

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

  async hasOverlap(
    roomId: string,
    slot: TimeRange,
    excludeScreeningId?: string
  ): Promise<boolean> {
    // règle mathématique qui permet de détecter si deux créneaux horaires se chevauchent.: Overlap: existing.startsAt < slot.end AND existing.endsAt > slot.start
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

  // ---------- Mapping ----------
  private toDomain(row: {
    id: string;
    roomId: string;
    movieId: string;
    startsAt: Date;
    endsAt: Date;
    basePrice: any; // Prisma Decimal
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
    });
  }
}