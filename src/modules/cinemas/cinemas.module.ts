import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { CinemaController } from "../../presentation/controllers/CinemaController";

import { CreateCinemaUseCase } from "../../application/use-cases/CreateCinema/CreateCinemaUseCase";
import { AddRoomToCinemaUseCase } from "../../application/use-cases/AddRoomToCinema/AddRoomToCinemaUseCase";

import { PrismaCinemaRepository } from "../../infrastructure/database/repositories/PrismaCinemaRepository";
import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";
import { ListCinemasUseCase } from "../../application/use-cases/ListCinemas/ListCinemasUseCase";

@Module({
  controllers: [CinemaController],
  providers: [
    PrismaService,

    // Tokens DI
    { provide: "ICinemaRepository", useClass: PrismaCinemaRepository },
    { provide: "IRoomRepository", useClass: PrismaRoomRepository },

    // Use cases
    CreateCinemaUseCase,
    AddRoomToCinemaUseCase,
    ListCinemasUseCase,
  ],
})
export class CinemasModule {}