import { Weekday } from "../../../domain/entities/OpeningHours";

export class GetOpeningHoursByCinemaInput {
  cinemaId: string;
}

export class GetOpeningHoursByCinemaOutput {
  openingHours: Array<{
    id: string;
    cinemaId: string;
    day: Weekday;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
}