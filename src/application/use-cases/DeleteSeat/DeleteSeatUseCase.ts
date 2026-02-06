import { Inject, Injectable } from "@nestjs/common";
import type { ISeatRepository } from "../../../domain/repositories";
import { DeleteSeatInput, DeleteSeatOutput } from "./DeleteSeatDto";
import { DeleteSeatValidator } from "./DeleteSeatValidator";

@Injectable()
export class DeleteSeatUseCase {
  constructor(
    @Inject("ISeatRepository")
    private readonly seatRepository: ISeatRepository
  ) {}

  async execute(input: DeleteSeatInput): Promise<DeleteSeatOutput> {
    const errors = DeleteSeatValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const existing = await this.seatRepository.findById(input.id);
    if (!existing) throw new Error(`Seat with ID ${input.id} not found`);

    await this.seatRepository.delete(input.id);

    return { id: input.id, deleted: true };
  }
}