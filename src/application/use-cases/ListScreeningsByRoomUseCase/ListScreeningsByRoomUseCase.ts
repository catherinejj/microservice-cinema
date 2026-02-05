import { Injectable, Inject } from "@nestjs/common";
import type { IScreeningRepository } from "../../../domain/repositories";
import { ListScreeningsByRoomInput, ListScreeningsByRoomOutput } from "./ListScreeningsByRoomDTO";

@Injectable()
export class ListScreeningsByRoomUseCase {
  constructor(
    @Inject("IScreeningRepository")
    private readonly screeningRepository: IScreeningRepository
  ) {}

  async execute(input: ListScreeningsByRoomInput): Promise<ListScreeningsByRoomOutput> {
    const rows = await this.screeningRepository.listByRoomId(input.roomId);

    return {
      screenings: rows.map((s) => ({
        id: s.id!,                 // Prisma cuid -> ok après persist
        roomId: s.roomId,
        movieId: s.movieId,
        startsAt: s.slot.start,
        endsAt: s.slot.end,
        basePrice: s.price.amount, // number
        currency: s.price.currency,
      })),
    };
  }
}