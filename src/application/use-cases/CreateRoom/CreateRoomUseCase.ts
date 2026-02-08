import { Injectable, Inject } from "@nestjs/common";
import type { ICinemaRepository, IRoomRepository } from "../../../domain/repositories";
import { Room } from "../../../domain/entities/Room";
import { CreateRoomInput, CreateRoomOutput } from "./CreateRoomDTO";
import { CreateRoomValidator } from "./CreateRoomValidator";

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject("ICinemaRepository") private readonly cinemaRepository: ICinemaRepository,
    @Inject("IRoomRepository") private readonly roomRepository: IRoomRepository
  ) {}

  async execute(input: CreateRoomInput): Promise<CreateRoomOutput> {
    const errors = CreateRoomValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const cinema = await this.cinemaRepository.findById(input.cinemaId);
    if (!cinema) throw new Error(`Cinema with ID ${input.cinemaId} not found`);

    const room = Room.create({
      cinemaId: input.cinemaId,
      name: input.roomName,
      capacitySeat: input.capacitySeat,
      seats: [],
      screenings: [],
    });

    const roomId = await this.roomRepository.create(room);
    return { roomId };
  }
}