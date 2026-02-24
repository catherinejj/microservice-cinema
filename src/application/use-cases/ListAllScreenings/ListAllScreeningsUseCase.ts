import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import type {
  IScreeningRepository,
  IRoomRepository,
  ICinemaRepository,
} from "../../../domain/repositories";
import { ScreeningFilters, TimeSlot } from "../../../domain/repositories/IScreeningRepository";
import { MovieCatalogService } from "../../services/MovieService/MovieCatalogService";

/** Renvoie true si l'heure UTC de la date correspond au créneau demandé.
 *  morning   : 8h-12h59 UTC (9h-13h59 CET)
 *  afternoon : 13h-16h59 UTC (14h-17h59 CET)
 *  evening   : 17h-21h59 UTC (18h-22h59 CET)
 */
function matchesTimeSlot(date: Date, slot: TimeSlot): boolean {
  const h = date.getUTCHours();
  if (slot === "morning")   return h >= 8  && h < 13;
  if (slot === "afternoon") return h >= 13 && h < 17;
  if (slot === "evening")   return h >= 17 && h < 22;
  return true;
}

type ScreeningAggregated = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  extraMinutes: number;
  price: any;
  movie: any;
  cinema: any;
  room: any;
};

@Injectable()
export class ListAllScreeningsUseCase {
  constructor(
    @Inject("IScreeningRepository") private readonly screeningRepo: IScreeningRepository,
    @Inject("IRoomRepository") private readonly roomRepo: IRoomRepository,
    @Inject("ICinemaRepository") private readonly cinemaRepo: ICinemaRepository,
    private readonly movieCatalog: MovieCatalogService
  ) {}

  async execute(filters?: ScreeningFilters) {
    let screenings = await this.screeningRepo.findAll(filters);

    // timeSlot : post-filtre (Prisma ne peut pas filtrer sur l'heure sans SQL brut)
    if (filters?.timeSlot) {
      screenings = screenings.filter((s) => matchesTimeSlot(s.slot.start, filters.timeSlot!));
    }

    const out: ScreeningAggregated[] = [];

    for (const s of screenings) {
      const room = await this.roomRepo.findById(s.roomId);
      if (!room) throw new NotFoundException(`Room not found: ${s.roomId}`);

      const cinema = await this.cinemaRepo.findById(room.cinemaId);
      if (!cinema) throw new NotFoundException(`Cinema not found: ${room.cinemaId}`);

      let movie: any = null;
      try {
        movie = await this.movieCatalog.getSummary(s.movieId);
      } catch {
        movie = { id: s.movieId, title: "Unknown", duration: null, posterUrl: null };
      }

      out.push({
        id: s.id!,
        startsAt: s.slot.start,
        endsAt: s.slot.end,
        extraMinutes: s.extraMinutes,
        price: {
          amount: s.price.amount.toFixed(2),
          currency: s.price.currency,
        },
        movie,
        cinema: {
          id: cinema.id,
          name: cinema.name,
          city: cinema.city,
          address: cinema.address,
          zipCode: cinema.zipCode,
          phoneNumber: cinema.phoneNumber,
        },
        room: {
          id: room.id,
          name: room.name,
          capacitySeat: room.capacitySeat,
        },
      });
    }

    return out;
  }
}
