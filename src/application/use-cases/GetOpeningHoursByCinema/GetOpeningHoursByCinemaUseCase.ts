import { Injectable, Inject } from "@nestjs/common";
import type { IOpeningHoursRepository } from "../../../domain/repositories/IOpeningHoursRepository";
import { Weekday } from "../../../domain/entities/OpeningHours";
import {
  GetOpeningHoursByCinemaInput,
  GetOpeningHoursByCinemaOutput,
} from "./GetOpeningHoursByCinemaDTO";
import { GetOpeningHoursByCinemaValidator } from "./GetOpeningHoursByCinemaValidator";

@Injectable()
export class GetOpeningHoursByCinemaUseCase {
  constructor(
    @Inject("IOpeningHoursRepository")
    private readonly openingHoursRepository: IOpeningHoursRepository
  ) {}

  async execute(
    input: GetOpeningHoursByCinemaInput
  ): Promise<GetOpeningHoursByCinemaOutput> {
    const errors = GetOpeningHoursByCinemaValidator.validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    const rows = await this.openingHoursRepository.findByCinemaId(
      input.cinemaId
    );

    return {
      openingHours: rows.map((h) => ({
        id: h.id!,
        cinemaId: h.cinemaId,
        day: h.day as Weekday,
        openTime: h.openTime,
        closeTime: h.closeTime,
        isClosed: h.isClosed,
      })),
    };
  }
}