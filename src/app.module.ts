import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

import { MoviesModule } from './presentation/controllers/movies/movies.module';
import { CinemasModule } from './presentation/controllers/cinemas/cinemas.module';
import { ScreeningsModule } from './presentation/controllers/screenings/screenings.module';

@Module({
  imports: [PrismaModule, MoviesModule, CinemasModule, ScreeningsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}