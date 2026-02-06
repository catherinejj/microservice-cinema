import { Module } from '@nestjs/common';
import { CinemasModule } from './modules/cinemas/cinemas.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SeatsModule } from './modules/seats/seats.module';
import { ScreeningsModule } from './modules/screenings/screenings.module';
import { OpeningHoursModule } from './modules/opening-hours/opening-hours.module';

@Module({
  imports: [
    CinemasModule,
    RoomsModule,
    SeatsModule,
    ScreeningsModule,
    OpeningHoursModule,
  ],
})
export class AppModule {}