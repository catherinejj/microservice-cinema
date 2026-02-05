import { Injectable, Inject } from "@nestjs/common";
import type { IRoomRepository, ISeatRepository } from "../../../domain/repositories";
import { Seat } from "../../../domain/entities/Seat";
import {
  GenerateSeatsForRoomInput,
  GenerateSeatsForRoomOutput,
} from "./GenerateSeatsForRoomDTO";
import { GenerateSeatsForRoomValidator } from "./GenerateSeatsForRoomValidator";

@Injectable()
export class GenerateSeatsForRoomUseCase {
  constructor(
    @Inject('ISeatRepository')
    private readonly seatRepository: ISeatRepository,

    @Inject('IRoomRepository')
    private readonly roomRepository: IRoomRepository
  ) {}

  async execute(input: GenerateSeatsForRoomInput): Promise<GenerateSeatsForRoomOutput> {
    const errors = GenerateSeatsForRoomValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const room = await this.roomRepository.findById(input.roomId);
    if (!room) throw new Error(`Room with ID ${input.roomId} not found`);

    const seats: Seat[] = [];

    for (const row of input.rows) {
      for (let number = 1; number <= input.seatsPerRow; number++) {
        const seat = Seat.create({
          roomId: input.roomId,
          row,
          number,
        });

        seats.push(seat);
      }
    }

    const countCreated = await this.seatRepository.createMany(seats);

    return { countCreated };
  }
}