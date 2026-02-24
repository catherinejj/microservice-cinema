import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import type {
  IScreeningRepository,
  IRoomRepository,
  ICinemaRepository,
} from "../../../domain/repositories";
import { MovieCatalogService } from "../../services/MovieService/MovieCatalogService";
import { ListScreeningsByMovieDTO } from "./ListScreeningsByMovieDTO";

type ScreeningAggregated = {
  id: string;
  startsAt: Date;
  endsAt: Date;
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

  async execute(dto: ListScreeningsByMovieDTO): Promise<ScreeningAggregated[]> {
    
    const { movieId, fromDate, toDate, hasAvailableSeats } = dto;

    const screenings = await this.screeningRepo.findByMovieId(movieId, {
      fromDate,
      toDate,
      hasAvailableSeats,
    });

    const out: ScreeningAggregated[] = [];

    for (const s of screenings) {
      const room = await this.roomRepo.findById(s.roomId);
      if (!room) throw new NotFoundException(`Room not found: ${s.roomId}`);

      const cinema = await this.cinemaRepo.findById(room.cinemaId);
      if (!cinema) throw new NotFoundException(`Cinema not found: ${room.cinemaId}`);

      const movie = await this.movieCatalog.getSummary(s.movieId);

      out.push({
        id: s.id!,
        startsAt: s.slot.start,
        endsAt: s.slot.end,
        price: s.price,
        movie,
        cinema,
        room,
      });
    }

    return out;
  }
}