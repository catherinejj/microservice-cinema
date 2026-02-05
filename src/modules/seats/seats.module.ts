import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { SeatController } from "../../presentation/controllers/SeatController";

import { PrismaSeatRepository } from "../../infrastructure/database/repositories/PrismaSeatRepository";
import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";

import { GenerateSeatsForRoomUseCase } from "../../application/use-cases/GenerateSeatsForRoom/GenerateSeatsForRoomUseCase";
import { ListSeatsByRoomUseCase } from "../../application/use-cases/ListSeatsByRoomUseCase/ListSeatsByRoomUseCase";

import { GetSeatByIdUseCase } from "../../application/use-cases/GetSeatById/GetSeatByIdUseCase";

@Module({
  controllers: [SeatController],
  providers: [
    PrismaService,

    // Bind interfaces → Prisma repos
    { provide: "ISeatRepository", useClass: PrismaSeatRepository },
    { provide: "IRoomRepository", useClass: PrismaRoomRepository },

    // Use cases
    GenerateSeatsForRoomUseCase,
    ListSeatsByRoomUseCase,
    GetSeatByIdUseCase,
  ],
})
export class SeatsModule {}