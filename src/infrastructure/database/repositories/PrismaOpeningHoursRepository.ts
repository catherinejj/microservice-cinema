import { Injectable } from "@nestjs/common";
import { Weekday as PrismaWeekday } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";
import { OpeningHours, Weekday } from "../../../domain/entities/OpeningHours";
import type { IOpeningHoursRepository } from "../../../domain/repositories/IOpeningHoursRepository";

@Injectable()
export class PrismaOpeningHoursRepository implements IOpeningHoursRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    cinemaId: string;
    day: Weekday;
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }): Promise<string> {
    const created = await this.prisma.openingHours.create({
      data: {
        cinemaId: data.cinemaId,
        day: data.day as unknown as PrismaWeekday,
        openTime: data.openTime,
        closeTime: data.closeTime,
        isClosed: data.isClosed ?? false,
      },
      select: { id: true },
    });

    return created.id;
  }

  async update(openingHours: OpeningHours): Promise<void> {
    await this.prisma.openingHours.update({
      where: { id: openingHours.id },
      data: {
        openTime: openingHours.openTime,
        closeTime: openingHours.closeTime,
        isClosed: openingHours.isClosed,
      },
    });
  }

  async findById(id: string): Promise<OpeningHours | null> {
    const row = await this.prisma.openingHours.findUnique({
      where: { id },
    });

    if (!row) return null;

    return OpeningHours.create({
      id: row.id,
      cinemaId: row.cinemaId,
      day: row.day as unknown as Weekday,
      openTime: row.openTime,
      closeTime: row.closeTime,
      isClosed: row.isClosed,
    });
  }

  async findByCinemaId(cinemaId: string): Promise<OpeningHours[]> {
    const rows = await this.prisma.openingHours.findMany({
      where: { cinemaId },
      orderBy: { day: "asc" },
    });

    return rows.map((row) =>
      OpeningHours.create({
        id: row.id,
        cinemaId: row.cinemaId,
       day: row.day as unknown as Weekday,
        openTime: row.openTime,
        closeTime: row.closeTime,
        isClosed: row.isClosed,
      })
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.openingHours.delete({
      where: { id },
    });
  }
}