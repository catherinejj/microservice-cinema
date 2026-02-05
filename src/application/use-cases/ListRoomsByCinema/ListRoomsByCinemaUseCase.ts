import { Injectable, Inject } from "@nestjs/common";
import type { IRoomRepository } from "../../../domain/repositories";
import { ListRoomsByCinemaInput, ListRoomsByCinemaOutput } from "./ListRoomsByCinemaDTO";
import { ListRoomsByCinemaValidator } from "./ListRoomsByCinemaValidator";

@Injectable()
export class ListRoomsByCinemaUseCase {
  constructor(@Inject("IRoomRepository") private readonly roomRepository: IRoomRepository) {}

  async execute(input: ListRoomsByCinemaInput): Promise<ListRoomsByCinemaOutput> {
    const errors = ListRoomsByCinemaValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const rooms = await this.roomRepository.listByCinemaId(input.cinemaId);

    return {
      rooms: rooms.map((r) => ({
        id: r.id!, // en DB il existe forcément
        cinemaId: r.cinemaId,
        name: r.name,
        capacitySeat: r.capacitySeat,
      })),
    };
  }
}