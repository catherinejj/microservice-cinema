import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { PrismaMovieRepository } from "../../infrastructure/database/repositories/PrismaMovieRepository";
import { CreateMovieUseCase } from "../../application/use-cases/CreateMovie/CreateMovieUseCase";

@Module({
  providers: [
    PrismaService,

    // DI token (propre)
    { provide: "IMovieRepository", useClass: PrismaMovieRepository },

    // Use case
    CreateMovieUseCase,
  ],
  exports: [CreateMovieUseCase],
})
export class MoviesModule {}