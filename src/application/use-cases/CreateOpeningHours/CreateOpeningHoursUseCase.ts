import { Injectable, Inject } from "@nestjs/common";
import type { IOpeningHoursRepository } from "../../../domain/repositories/IOpeningHoursRepository";
import { OpeningHours } from "../../../domain/entities/OpeningHours";
import { CreateOpeningHoursInput, CreateOpeningHoursOutput } from "./CreateOpeningHoursDTO";
import { CreateOpeningHoursValidator } from "./CreateOpeningHoursValidator";

@Injectable()
export class CreateOpeningHoursUseCase {
  constructor(
    @Inject("IOpeningHoursRepository")
    private readonly openingHoursRepository: IOpeningHoursRepository
  ) {}

  async execute(input: CreateOpeningHoursInput): Promise<CreateOpeningHoursOutput> {
    const errors = CreateOpeningHoursValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const hours = OpeningHours.create({
      cinemaId: input.cinemaId,
      day: input.day,
      openTime: input.openTime,
      closeTime: input.closeTime,
      isClosed: input.isClosed ?? false,
    });

    const id = await this.openingHoursRepository.create({
      cinemaId: hours.cinemaId,
      day: hours.day,
      openTime: hours.openTime,
      closeTime: hours.closeTime,
      isClosed: hours.isClosed,
    });

    return { id };
  }
}