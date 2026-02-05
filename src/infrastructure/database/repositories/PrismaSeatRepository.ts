import { Injectable } from "@nestjs/common";
import type { ISeatRepository } from "../../../domain/repositories";
import { Seat } from "../../../domain/entities/Seat";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class PrismaSeatRepository implements ISeatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(seat: Seat): Promise<void> {
    await this.prisma.seat.create({
      data: {
        roomId: seat.roomId,
        row: seat.row,
        number: seat.number,
      },
    });
  }

  async createMany(seats: Seat[]): Promise<number> {
    if (seats.length === 0) return 0;

    const result = await this.prisma.seat.createMany({
      data: seats.map((s) => ({
        roomId: s.roomId,
        row: s.row,
        number: s.number,
      })),
      skipDuplicates: true,
    });

    return result.count;
  }

  async findById(id: string): Promise<Seat | null> {
    const row = await this.prisma.seat.findUnique({
      where: { id },
    });

    return row ? this.toDomain(row) : null;
  }

  async findByRoomId(roomId: string): Promise<Seat[]> {
    const rows = await this.prisma.seat.findMany({
      where: { roomId },
      orderBy: [{ row: "asc" }, { number: "asc" }],
    });

    return rows.map((r) => this.toDomain(r));
  }

  async existsInRoom(
    roomId: string,
    row: string,
    number: number
  ): Promise<boolean> {
    const normalizedRow = row.trim().toUpperCase();

    const found = await this.prisma.seat.findUnique({
      where: {
        roomId_row_number: {
          roomId,
          row: normalizedRow,
          number,
        },
      },
      select: { id: true },
    });

    return !!found;
  }

  // ---------- Mapping ----------
  private toDomain(row: {
    id: string;
    roomId: string;
    row: string;
    number: number;
  }): Seat {
    return Seat.create({
      id: row.id,
      roomId: row.roomId,
      row: row.row,
      number: row.number,
    });
  }
}