import { Module } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

import { RoomController } from "../../presentation/controllers/RoomController";

import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";
import { PrismaCinemaRepository } from "../../infrastructure/database/repositories/PrismaCinemaRepository";

import { CreateRoomUseCase } from "../../application/use-cases/CreateRoom/CreateRoomUseCase";
import { ListRoomsByCinemaUseCase } from "../../application/use-cases/ListRoomsByCinema/ListRoomsByCinemaUseCase";
import { UpdateRoomUseCase } from "../../application/use-cases/UpdateRoom/UpdateRoomUseCase";
import { DeleteRoomUseCase } from  "../../application/use-cases/DeleteRoom/DeleteRoomUseCase";
@Module({
  controllers: [RoomController],
  providers: [
    PrismaService,

    CreateRoomUseCase,
    ListRoomsByCinemaUseCase,
    UpdateRoomUseCase,
	  DeleteRoomUseCase,

    PrismaRoomRepository,
    PrismaCinemaRepository,

    { provide: "IRoomRepository", useClass: PrismaRoomRepository },
    { provide: "ICinemaRepository", useClass: PrismaCinemaRepository },
  ],
})
export class RoomsModule {}