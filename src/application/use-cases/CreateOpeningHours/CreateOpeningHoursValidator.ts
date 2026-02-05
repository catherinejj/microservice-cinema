import { CreateOpeningHoursInput } from "./CreateOpeningHoursDTO";

export class CreateOpeningHoursValidator {
  static validate(input: CreateOpeningHoursInput): string[] {
    const errors: string[] = [];

    if (!input.cinemaId) errors.push("cinemaId is required");
    if (!input.day) errors.push("day is required");
    if (!input.openTime) errors.push("openTime is required");
    if (!input.closeTime) errors.push("closeTime is required");

    return errors;
  }
}