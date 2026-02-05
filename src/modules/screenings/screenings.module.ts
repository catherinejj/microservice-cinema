import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

import { CreateScreeningUseCase } from "../../application/use-cases/CreateScreening/CreateScreeningUseCase";

import { PrismaMovieRepository } from "../../infrastructure/database/repositories/PrismaMovieRepository";
import { PrismaRoomRepository } from "../../infrastructure/database/repositories/PrismaRoomRepository";
import { PrismaScreeningRepository } from "../../infrastructure/database/repositories/PrismaScreeningRepository";

@Module({
  providers: [
    PrismaService,

    // Bind interfaces → Prisma repos
    { provide: 'IMovieRepository', useClass: PrismaMovieRepository },
    { provide: 'IRoomRepository', useClass: PrismaRoomRepository },
    { provide: 'IScreeningRepository', useClass: PrismaScreeningRepository },

    // Use case
    CreateScreeningUseCase,
  ],
})
export class ScreeningsModule {}