import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { SeatController } from "../../presentation/controllers/SeatController";

import { PrismaSeatRepository } from "../../infrastructure/database/repositories/PrismaSeatRepository";

import { GetSeatByIdUseCase } from "../../application/use-cases/GetSeatById/GetSeatByIdUseCase";
import { ListSeatsByRoomUseCase } from "../../application/use-cases/ListSeatsByRoomUseCase/ListSeatsByRoomUseCase";
import { UpdateSeatUseCase } from "../../application/use-cases/UpdateSeat/UpdateSeatUseCase";
import { DeleteSeatUseCase } from "../../application/use-cases/DeleteSeat/DeleteSeatUseCase";
import { CreateSeatUseCase } from "src/application/use-cases/CreateSeat/CreateSeatUseCase";
import { PrismaRoomRepository } from "src/infrastructure/database/repositories/PrismaRoomRepository";

@Module({
  controllers: [SeatController],
  providers: [
    PrismaService,

    { provide: "ISeatRepository", useClass: PrismaSeatRepository },
    { provide: "IRoomRepository", useClass: PrismaRoomRepository },

    GetSeatByIdUseCase,
    CreateSeatUseCase,
    ListSeatsByRoomUseCase,
    UpdateSeatUseCase,
    DeleteSeatUseCase,
  ],
})
export class SeatsModule {}