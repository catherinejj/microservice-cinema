import { Inject, Injectable } from "@nestjs/common";
import type { IScreeningRepository, IRoomRepository, ICinemaRepository } from "../../../domain/repositories";
import type { IMovieCatalog } from "../../ports/IMovieCatalog";
import { GetScreeningByIdInput, GetScreeningByIdOutput } from "./GetScreeningByIdDTO";

@Injectable()
export class GetScreeningByIdUseCase {
  constructor(
    @Inject("IScreeningRepository")
    private readonly screeningRepo: IScreeningRepository,

    @Inject("IRoomRepository")
    private readonly roomRepo: IRoomRepository,

    @Inject("ICinemaRepository")
    private readonly cinemaRepo: ICinemaRepository,

    @Inject("IMovieCatalog")
    private readonly movieCatalog: IMovieCatalog
  ) {}

  async execute(input: GetScreeningByIdInput): Promise<GetScreeningByIdOutput> {
    const screening = await this.screeningRepo.findById(input.id);
    if (!screening) throw new Error(`Screening ${input.id} not found`);

    // Room
    const room = await this.roomRepo.findById(screening.roomId);
    if (!room || !room.id) throw new Error(`Room ${screening.roomId} not found`);

    // Cinema
    const cinema = await this.cinemaRepo.findById(room.cinemaId);
    if (!cinema || !cinema.id) throw new Error(`Cinema ${room.cinemaId} not found`);

    // Movie (external microservice)
    const movie = await this.movieCatalog.getSummary(screening.movieId);
    if (!movie) throw new Error(`Movie ${screening.movieId} not found`);

    return {
      id: screening.id as string,
      startsAt: screening.slot.start,
        endsAt: screening.slot.end,
        price: {
        amount: screening.price.amount.toFixed(2),
        currency: screening.price.currency,
        },
      movie: {
        id: movie.id,
        title: movie.title,
        duration: movie.duration,
        posterUrl: movie.posterUrl,
      },
      cinema: {
        id: cinema.id as string,
        name: cinema.name,
        city: cinema.city,
        address: cinema.address,
        zipCode: cinema.zipCode,
        phoneNumber: cinema.phoneNumber,
      },
      room: {
        id: room.id as string,
        name: room.name,
        capacitySeat: room.capacitySeat,
      },
    };
  }
}