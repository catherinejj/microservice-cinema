import { Inject, Injectable } from "@nestjs/common";
import type { IScreeningRepository } from "../../../domain/repositories";
import { DeleteScreeningInput, DeleteScreeningOutput } from "./DeleteScreeningDTO";
import { DeleteScreeningValidator } from "./DeleteScreeningValidator";

@Injectable()
export class DeleteScreeningUseCase {
  constructor(
    @Inject("IScreeningRepository")
    private readonly screeningRepository: IScreeningRepository
  ) {}

  async execute(input: DeleteScreeningInput): Promise<DeleteScreeningOutput> {
    const errors = DeleteScreeningValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const existing = await this.screeningRepository.findById(input.id);
    if (!existing) throw new Error(`Screening with ID ${input.id} not found`);

    await this.screeningRepository.delete(input.id);

    return { id: input.id, deleted: true };
  }
}