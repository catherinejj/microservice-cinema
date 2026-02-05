import { Module } from "@nestjs/common";

import { OpeningHoursController } from "../../presentation/controllers/OpeningHoursController";

import { CreateOpeningHoursUseCase } from "../../application/use-cases/CreateOpeningHours/CreateOpeningHoursUseCase";
import { GetOpeningHoursByCinemaUseCase } from "../../application/use-cases/GetOpeningHoursByCinema/GetOpeningHoursByCinemaUseCase";

import { PrismaService } from "../../prisma/prisma.service";
import { PrismaOpeningHoursRepository } from "../../infrastructure/database/repositories/PrismaOpeningHoursRepository";

@Module({
  controllers: [OpeningHoursController],
  providers: [
    PrismaService,
    CreateOpeningHoursUseCase,
    GetOpeningHoursByCinemaUseCase,
    PrismaOpeningHoursRepository,
    { provide: "IOpeningHoursRepository", useClass: PrismaOpeningHoursRepository },
  ],
})
export class OpeningHoursModule {}