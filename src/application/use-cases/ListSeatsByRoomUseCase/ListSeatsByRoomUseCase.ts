import { Injectable, Inject } from "@nestjs/common";
import type { ISeatRepository } from "../../../domain/repositories";
import { ListSeatsByRoomInput, ListSeatsByRoomOutput } from "./ListSeatsByRoomDTO";
import { ListSeatsByRoomValidator } from "./ListSeatsByRoomValidator";

@Injectable()
export class ListSeatsByRoomUseCase {
  constructor(
    @Inject("ISeatRepository")
    private readonly seatRepository: ISeatRepository
  ) {}

  async execute(input: ListSeatsByRoomInput): Promise<ListSeatsByRoomOutput> {
    const errors = ListSeatsByRoomValidator.validate(input);
    if (errors.length > 0)
      throw new Error(`Validation failed: ${errors.join(", ")}`);

    const rows = await this.seatRepository.findByRoomId(input.roomId);

    return {
      seats: rows.map((s) => ({
        id: s.id!,
        roomId: s.roomId,
        row: s.row,
        number: s.number,
      })),
    };
  }
}