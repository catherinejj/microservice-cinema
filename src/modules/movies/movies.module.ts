import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaMovieRepository } from '../../infrastructure/database/repositories/PrismaMovieRepository';
import { CreateMovieUseCase } from '../../application/use-cases/CreateMovie/CreateMovieUseCase';

@Module({
  providers: [
    PrismaService,
    PrismaMovieRepository,
    CreateMovieUseCase,
    {
      provide: 'IMovieRepository',
      useClass: PrismaMovieRepository,
    },
  ],
  exports: [CreateMovieUseCase],
})
export class MoviesModule {}