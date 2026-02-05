import { OpeningHours, Weekday } from "../entities/OpeningHours";

export interface IOpeningHoursRepository {
  create(data: {
    cinemaId: string;
    day: Weekday;
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
  }): Promise<string>;

  update(openingHours: OpeningHours): Promise<void>;

  findById(id: string): Promise<OpeningHours | null>;

  findByCinemaId(cinemaId: string): Promise<OpeningHours[]>;

  delete(id: string): Promise<void>;
}