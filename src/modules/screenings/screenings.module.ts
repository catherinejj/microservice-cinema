import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { ScreeningController } from "../../presentation/controllers/ScreeningController";

import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";
import { PrismaScreeningRepository } from "../../infrastructure/database/repositories/PrismaScreeningRepository";

import { HttpMovieCatalogClient } from "../../infrastructure/http/clients/HttpMovieCatalogClient";
import { MovieCatalogService } from "../../application/services/MovieService/MovieCatalogService";
import { PrismaCinemaRepository } from "../../infrastructure/database/repositories/PrismaCinemaRepository";
import { CreateScreeningUseCase } from "../../application/use-cases/CreateScreening/CreateScreeningUseCase";
import { ListScreeningsByRoomUseCase } from "../../application/use-cases/ListScreeningsByRoomUseCase/ListScreeningsByRoomUseCase";
import { UpdateScreeningUseCase } from "../../application/use-cases/UpdateScreening/UpdateScreeningUseCase";
import { DeleteScreeningUseCase } from "../../application/use-cases/DeleteScreening/DeleteScreeningUseCase";
import { GetScreeningByIdUseCase } from "src/application/use-cases/GetScreeningDetailsById/GetScreeningByIdUseCase";

@Module({
  controllers: [ScreeningController],
  providers: [
    PrismaService,

    // repos locaux
    { provide: "IRoomRepository", useClass: PrismaRoomRepository },
    { provide: "IScreeningRepository", useClass: PrismaScreeningRepository },
    { provide: "ICinemaRepository", useClass: PrismaCinemaRepository },

    // movie externe
    HttpMovieCatalogClient,
    MovieCatalogService,
    { provide: "IMovieCatalog", useClass: MovieCatalogService },

    // use-cases
    CreateScreeningUseCase,
    ListScreeningsByRoomUseCase,
    UpdateScreeningUseCase,
    DeleteScreeningUseCase,
    GetScreeningByIdUseCase,
  ],
})
export class ScreeningsModule {}