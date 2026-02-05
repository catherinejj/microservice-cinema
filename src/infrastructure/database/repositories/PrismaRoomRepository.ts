import { Injectable } from "@nestjs/common";
import type { IRoomRepository } from "../../../domain/repositories";
import { Room } from "../../../domain/entities/Room";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class PrismaRoomRepository implements IRoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(room: Room): Promise<string> {
    const created = await this.prisma.room.create({
      data: {
        ...(room.id ? { id: room.id } : {}),
        cinemaId: room.cinemaId,
        name: room.name,
        capacitySeat: room.capacitySeat,
      },
      select: { id: true },
    });

    return created.id;
  }

  async update(room: Room): Promise<void> {
    if (!room.id) {
      throw new Error("PrismaRoomRepository.update: room.id is required");
    }

    await this.prisma.room.update({
      where: { id: room.id },
      data: {
        name: room.name,
        capacitySeat: room.capacitySeat,
        // cinemaId: room.cinemaId  // en général on ne change pas le cinemaId d’une room
      },
    });
  }

  async findById(id: string): Promise<Room | null> {
    const row = await this.prisma.room.findUnique({
      where: { id },
    });

    return row ? this.toDomain(row) : null;
  }

  async listByCinemaId(cinemaId: string): Promise<Room[]> {
    const rows = await this.prisma.room.findMany({
      where: { cinemaId },
      orderBy: { name: "asc" },
    });

    return rows.map((r) => this.toDomain(r));
  }

  // ---------- Mapping ----------
  private toDomain(row: {
    id: string;
    cinemaId: string;
    name: string;
    capacitySeat: number;
  }): Room {
    return Room.create({
      id: row.id,
      cinemaId: row.cinemaId,
      name: row.name,
      capacitySeat: row.capacitySeat,
    });
  }
}