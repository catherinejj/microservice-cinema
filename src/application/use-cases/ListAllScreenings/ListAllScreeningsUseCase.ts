import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import type {
  IScreeningRepository,
  IRoomRepository,
  ICinemaRepository,
} from "../../../domain/repositories";
import { MovieCatalogService } from "../../services/MovieService/MovieCatalogService";

type ScreeningAggregated = {
  id: string;
  startsAt: Date;
  endsAt: Date;
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

  async execute(filters?: ScreeningFilters): Promise<ScreeningAggregated[]> {
    const screenings = await this.screeningRepo.findAll(filters);

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