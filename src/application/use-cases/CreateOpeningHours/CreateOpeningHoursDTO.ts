import { Weekday } from "../../../domain/entities/OpeningHours";

export class CreateOpeningHoursInput {
  cinemaId: string;
  day: Weekday;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
}

export class CreateOpeningHoursOutput {
  id: string;
}