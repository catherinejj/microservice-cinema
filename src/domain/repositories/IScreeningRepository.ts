import { Screening } from "../entities/Screening";
import { TimeRange } from "../value-objects/TimeRange";

export type TimeSlot = "morning" | "afternoon" | "evening";

export interface ScreeningFilters {
  // Filtres de date
  fromDate?: Date;
  toDate?: Date;
  // Disponibilité des places (décrémenté par le service booking)
  hasAvailableSeats?: boolean;
  // Lieu
  cinemaId?: string;
  cityName?: string;
  // Prix maximum (en euros)
  priceMax?: number;
  // Créneau horaire : morning (10-14h), afternoon (14-18h), evening (18-23h)
  timeSlot?: TimeSlot;
  // Tri
  sortBy?: "startsAt" | "price";
  sortOrder?: "asc" | "desc";
}

export interface IScreeningRepository {
  create(screening: Screening): Promise<string>;
  update(screening: Screening): Promise<void>;

  findAll(filters?: ScreeningFilters): Promise<Screening[]>;
  findByMovieId(movieId: string, filters?: ScreeningFilters): Promise<Screening[]>;
  findMovieIdsByCinemaId(cinemaId: string): Promise<string[]>;

  findById(id: string): Promise<Screening | null>;
  listByRoomId(roomId: string, from?: Date, to?: Date): Promise<Screening[]>;
  hasOverlap(roomId: string, slot: TimeRange, excludeScreeningId?: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}