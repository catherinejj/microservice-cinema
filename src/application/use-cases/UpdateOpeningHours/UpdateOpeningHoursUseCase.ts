import { Inject, Injectable } from "@nestjs/common";
import type { IOpeningHoursRepository } from "../../../domain/repositories/IOpeningHoursRepository";
import { UpdateOpeningHoursInput, UpdateOpeningHoursOutput } from "./UpdateOpeningHoursDto";
import { UpdateOpeningHoursValidator } from "./UpdateOpeningHoursValidator";

@Injectable()
export class UpdateOpeningHoursUseCase {
  constructor(
    @Inject("IOpeningHoursRepository")
    private readonly openingHoursRepository: IOpeningHoursRepository
  ) {}

  async execute(input: UpdateOpeningHoursInput): Promise<UpdateOpeningHoursOutput> {
    const errors = UpdateOpeningHoursValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const oh = await this.openingHoursRepository.findById(input.id);
    if (!oh) throw new Error(`OpeningHours with ID ${input.id} not found`);

    // règle simple :
    // - si isClosed === true => closeForTheDay()
    // - sinon openForTheDay(openTime, closeTime) avec fallback sur valeurs existantes
    if (input.isClosed === true) {
      oh.closeForTheDay();
    } else if (input.isClosed === false || input.openTime !== undefined || input.closeTime !== undefined) {
      const openTime = input.openTime ?? oh.openTime;
      const closeTime = input.closeTime ?? oh.closeTime;
      oh.openForTheDay(openTime, closeTime);
    }

    await this.openingHoursRepository.update(oh);

    return { id: input.id };
  }
}