import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

// import { CinemasController } from "../../../presentation/controllers/cinemas/cinemas.controller";

import { CreateCinemaUseCase } from "../../application/use-cases/CreateCinema/CreateCinemaUseCase";
import { AddRoomToCinemaUseCase } from "../../application/use-cases/AddRoomToCinema/AddRoomToCinemaUseCase";

import { PrismaCinemaRepository } from "../../infrastructure/database/repositories/PrismaCinemaRepository";
import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";

@Module({
  // controllers: [CinemasController],
  providers: [
    PrismaService,
    PrismaCinemaRepository,
    PrismaRoomRepository,
    CreateCinemaUseCase,
    AddRoomToCinemaUseCase,
  ],
  exports: [CreateCinemaUseCase, AddRoomToCinemaUseCase],
})
export class CinemasModule {}