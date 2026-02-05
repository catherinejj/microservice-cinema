import { Injectable } from "@nestjs/common";
import type { ICinemaRepository, IRoomRepository } from "../../../domain/repositories";
import { Room } from "../../../domain/entities/Room";
import { AddRoomToCinemaInput, AddRoomToCinemaOutput } from "./AddRoomToCinemaDTO";
import { AddRoomToCinemaValidator } from "./AddRoomToCinemaValidator";

@Injectable()
export class AddRoomToCinemaUseCase {
  constructor(
    private readonly cinemaRepository: ICinemaRepository,
    private readonly roomRepository: IRoomRepository
  ) {}

  async execute(input: AddRoomToCinemaInput): Promise<AddRoomToCinemaOutput> {
    const errors = AddRoomToCinemaValidator.validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    const cinema = await this.cinemaRepository.findById(input.cinemaId);
    if (!cinema) {
      throw new Error(`Cinema with ID ${input.cinemaId} not found`);
    }

    const room = Room.createNew({
      cinemaId: input.cinemaId,
      name: input.roomName,
      capacitySeat: input.capacitySeat,
    });

    const roomId = await this.roomRepository.create(room);

    return { roomId };
  }
}