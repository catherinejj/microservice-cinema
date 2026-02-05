import { Weekday } from "../../domain/entities/OpeningHours";

export class OpeningHoursResponseDto {
  id: string;
  cinemaId: string;
  day: Weekday;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}