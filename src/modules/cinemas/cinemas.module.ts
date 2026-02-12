import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { CinemaController } from "../../presentation/controllers/CinemaController";

import { CreateCinemaUseCase } from "../../application/use-cases/CreateCinema/CreateCinemaUseCase";
import { AddRoomToCinemaUseCase } from "../../application/use-cases/AddRoomToCinema/AddRoomToCinemaUseCase";
import { ListCinemasUseCase } from "../../application/use-cases/ListCinemas/ListCinemasUseCase";
import { GetCinemaByIdUseCase } from "../../application/use-cases/GetCinemaById/GetCinemaByIdUseCase";

import { PrismaCinemaRepository } from "../../infrastructure/database/repositories/PrismaCinemaRepository";
import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";
import { UpdateCinemaUseCase } from "../../application/use-cases/UpdateCinema/UpdateCinemaUseCase";
import { DeleteCinemaUseCase } from "../../application/use-cases/DeleteCinema/DeleteCinemaUseCase";
@Module({
  controllers: [CinemaController],
  providers: [
    PrismaService,

    { provide: "ICinemaRepository", useClass: PrismaCinemaRepository },
    { provide: "IRoomRepository", useClass: PrismaRoomRepository },

    CreateCinemaUseCase,
    AddRoomToCinemaUseCase,
    ListCinemasUseCase,
    GetCinemaByIdUseCase,
    UpdateCinemaUseCase,
    DeleteCinemaUseCase,
  ],
})
export class CinemasModule {}