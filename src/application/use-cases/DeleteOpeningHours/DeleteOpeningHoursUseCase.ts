import { Inject, Injectable } from "@nestjs/common";
import type { IOpeningHoursRepository } from "../../../domain/repositories/IOpeningHoursRepository";
import { DeleteOpeningHoursInput, DeleteOpeningHoursOutput } from "./DeleteOpeningHoursDto";
import { DeleteOpeningHoursValidator } from "./DeleteOpeningHoursValidator";

@Injectable()
export class DeleteOpeningHoursUseCase {
  constructor(
    @Inject("IOpeningHoursRepository")
    private readonly openingHoursRepository: IOpeningHoursRepository
  ) {}

  async execute(input: DeleteOpeningHoursInput): Promise<DeleteOpeningHoursOutput> {
    const errors = DeleteOpeningHoursValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const exists = await this.openingHoursRepository.findById(input.id);
    if (!exists) throw new Error(`OpeningHours with ID ${input.id} not found`);

    await this.openingHoursRepository.delete(input.id);

    return { id: input.id, deleted: true };
  }
}