import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { CinemaController } from "../../presentation/controllers/CinemaController";

import { CreateCinemaUseCase } from "../../application/use-cases/CreateCinema/CreateCinemaUseCase";
import { AddRoomToCinemaUseCase } from "../../application/use-cases/AddRoomToCinema/AddRoomToCinemaUseCase";
import { ListCinemasUseCase } from "../../application/use-cases/ListCinemas/ListCinemasUseCase";
import { GetCinemaByIdUseCase } from "../../application/use-cases/GetCinemaById/GetCinemaByIdUseCase";
import { UpdateCinemaUseCase } from "../../application/use-cases/UpdateCinema/UpdateCinemaUseCase";
import { DeleteCinemaUseCase } from "../../application/use-cases/DeleteCinema/DeleteCinemaUseCase";
import { ListMoviesByCinemaUseCase } from "../../application/use-cases/ListMoviesByCinema/ListMoviesByCinemaUseCase";

import { PrismaCinemaRepository } from "../../infrastructure/database/repositories/PrismaCinemaRepository";
import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";
import { PrismaScreeningRepository } from "../../infrastructure/database/repositories/PrismaScreeningRepository";

import { MovieCatalogService } from "../../application/services/MovieService/MovieCatalogService";
import { HttpMovieCatalogClient } from "../../infrastructure/http/clients/HttpMovieCatalogClient";

@Module({
  controllers: [CinemaController],
  providers: [
    PrismaService,

    { provide: "ICinemaRepository", useClass: PrismaCinemaRepository },
    { provide: "IRoomRepository", useClass: PrismaRoomRepository },

    // ✅ AJOUT : requis par ListMoviesByCinemaUseCase
    { provide: "IScreeningRepository", useClass: PrismaScreeningRepository },

    // ✅ AJOUT : requis si ton ListMoviesByCinemaUseCase utilise MovieCatalogService
    HttpMovieCatalogClient,
    MovieCatalogService,

    CreateCinemaUseCase,
    AddRoomToCinemaUseCase,
    ListCinemasUseCase,
    GetCinemaByIdUseCase,
    UpdateCinemaUseCase,
    DeleteCinemaUseCase,
    ListMoviesByCinemaUseCase,
  ],
})
export class CinemasModule {}