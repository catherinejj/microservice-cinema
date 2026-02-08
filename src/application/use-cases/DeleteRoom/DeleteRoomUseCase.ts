import { Inject, Injectable } from "@nestjs/common";
import type { IRoomRepository } from "../../../domain/repositories";
import { DeleteRoomInput, DeleteRoomOutput } from "./DeleteRoomDTO";
import { DeleteRoomValidator } from "./DeleteRoomValidator";

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    @Inject("IRoomRepository")
    private readonly roomRepository: IRoomRepository
  ) {}

  async execute(input: DeleteRoomInput): Promise<DeleteRoomOutput> {
    const errors = DeleteRoomValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const room = await this.roomRepository.findById(input.id);
    if (!room) throw new Error(`Room with ID ${input.id} not found`);

    await this.roomRepository.delete(input.id);

    return { id: input.id, deleted: true };
  }
}