import { CreateScreeningInput } from "./CreateScreeningDTO";

export class CreateScreeningValidator {
  static validate(input: CreateScreeningInput): string[] {
    const errors: string[] = [];

    if (!input.movieId) errors.push("movieId is required");
    if (!input.roomId) errors.push("roomId is required");
    if (!input.startsAt) errors.push("startsAt is required");
    if (typeof input.basePrice !== "number") errors.push("basePrice must be a number");
    if (!input.currency) errors.push("currency is required");

    if (input.extraMinutes !== undefined) {
      if (!Number.isInteger(input.extraMinutes) || input.extraMinutes < 0) {
        errors.push("extraMinutes must be an integer >= 0");
      }
    }

    return errors;
  }
}