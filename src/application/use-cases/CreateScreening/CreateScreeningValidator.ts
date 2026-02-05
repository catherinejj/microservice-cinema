import { CreateScreeningInput } from "./CreateScreeningDTO";

export class CreateScreeningValidator {
  static validate(input: CreateScreeningInput): string[] {
    const errors: string[] = [];

    if (!input.movieId || input.movieId.trim().length === 0) {
      errors.push("Movie ID is required");
    }

    if (!input.roomId || input.roomId.trim().length === 0) {
      errors.push("Room ID is required");
    }

    if (!input.startsAt || !(input.startsAt instanceof Date)) {
      errors.push("Start time must be a valid Date");
    }

    if (input.extraMinutes < 0) {
      errors.push("Extra minutes cannot be negative");
    }

    if (input.basePrice <= 0) {
      errors.push("Base price must be greater than 0");
    }

    if (!input.currency || input.currency.trim().length === 0) {
      errors.push("Currency is required");
    }

    return errors;
  }
}
