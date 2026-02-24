import { Screening } from "../entities/Screening";
import { TimeRange } from "../value-objects/TimeRange";

export interface ScreeningFilters {
  fromDate?: Date;
  toDate?: Date;
  hasAvailableSeats?: boolean; // capacitySeat > 0 (decremented by booking service)
}

export interface IScreeningRepository {
  create(screening: Screening): Promise<string>;
  update(screening: Screening): Promise<void>;

  findAll(): Promise<Screening[]>;
  findByMovieId(movieId: string): Promise<Screening[]>;
  findMovieIdsByCinemaId(cinemaId: string): Promise<string[]>;

  findById(id: string): Promise<Screening | null>;
  listByRoomId(roomId: string, from?: Date, to?: Date): Promise<Screening[]>;
  hasOverlap(roomId: string, slot: TimeRange, excludeScreeningId?: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}