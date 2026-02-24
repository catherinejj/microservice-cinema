import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import type {
  IScreeningRepository,
  IRoomRepository,
  ICinemaRepository,
} from "../../../domain/repositories";
import { TimeSlot } from "../../../domain/repositories/IScreeningRepository";
import { MovieCatalogService } from "../../services/MovieService/MovieCatalogService";
import { ListScreeningsByMovieDTO } from "./ListScreeningsByMovieDTO";

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
  price: any; // tu peux typer Money si tu veux
  movie: any; // MovieSummaryDto
  cinema: any; // Cinema entity
  room: any; // Room entity
};

@Injectable()
export class ListScreeningsByMovieUseCase {
  constructor(
    @Inject("IScreeningRepository") private readonly screeningRepo: IScreeningRepository,
    @Inject("IRoomRepository") private readonly roomRepo: IRoomRepository,
    @Inject("ICinemaRepository") private readonly cinemaRepo: ICinemaRepository,
    private readonly movieCatalog: MovieCatalogService
  ) {}

  async execute(dto: ListScreeningsByMovieDTO) {
    
    const { movieId, timeSlot, ...filters } = dto;

    let screenings = await this.screeningRepo.findByMovieId(movieId, filters);

    if (timeSlot) {
      screenings = screenings.filter((s) => matchesTimeSlot(s.slot.start, timeSlot));
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
