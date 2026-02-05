import { CreateScreeningInput } from "./CreateScreeningDTO";

export class CreateScreeningValidator {
  static validate(input: CreateScreeningInput): string[] {
    const errors: string[] = [];

    if (!input.movieId) errors.push("movieId is required");
    if (!input.roomId) errors.push("roomId is required");
    if (!input.startsAt) errors.push("startsAt is required");
    if (!input.endsAt) errors.push("endsAt is required");

    return errors;
  }
}