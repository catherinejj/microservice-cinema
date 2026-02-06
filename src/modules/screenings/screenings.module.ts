import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { ScreeningController } from "../../presentation/controllers/ScreeningController";

import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";
import { PrismaScreeningRepository } from "../../infrastructure/database/repositories/PrismaScreeningRepository";

import { HttpMovieCatalogClient } from "../../infrastructure/http/clients/HttpMovieCatalogClient";
import { MovieCatalogService } from "../../application/services/MovieService/MovieCatalogService";

import { CreateScreeningUseCase } from "../../application/use-cases/CreateScreening/CreateScreeningUseCase";
import { ListScreeningsByRoomUseCase } from "../../application/use-cases/ListScreeningsByRoomUseCase/ListScreeningsByRoomUseCase";

@Module({
  controllers: [ScreeningController],
  providers: [
    PrismaService,

    // repos locaux
    { provide: "IRoomRepository", useClass: PrismaRoomRepository },
    { provide: "IScreeningRepository", useClass: PrismaScreeningRepository },

    // movie externe
    HttpMovieCatalogClient,
    MovieCatalogService,
    { provide: "IMovieCatalog", useClass: MovieCatalogService },

    // use-cases
    CreateScreeningUseCase,
    ListScreeningsByRoomUseCase,
  ],
})
export class ScreeningsModule {}