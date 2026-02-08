import { Inject, Injectable } from "@nestjs/common";
import type { IRoomRepository } from "../../../domain/repositories";
import { UpdateRoomInput, UpdateRoomOutput } from "./UpdateRoomDTO";
import { UpdateRoomValidator } from "./UpdateRoomValidator";

@Injectable()
export class UpdateRoomUseCase {
  constructor(
    @Inject("IRoomRepository")
    private readonly roomRepository: IRoomRepository
  ) {}

  async execute(input: UpdateRoomInput): Promise<UpdateRoomOutput> {
    const errors = UpdateRoomValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const room = await this.roomRepository.findById(input.id);
    if (!room) throw new Error(`Room with ID ${input.id} not found`);

    if (input.name !== undefined) {
      room.rename(input.name);
    }
    if (input.capacitySeat !== undefined) {
      room.changeCapacity(input.capacitySeat);
    }

    await this.roomRepository.update(room);

    return { id: input.id };
  }
}