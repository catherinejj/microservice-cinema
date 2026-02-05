import { GetOpeningHoursByCinemaInput } from "./GetOpeningHoursByCinemaDTO";

export class GetOpeningHoursByCinemaValidator {
  static validate(input: GetOpeningHoursByCinemaInput): string[] {
    const errors: string[] = [];
    if (!input.cinemaId) errors.push("cinemaId is required");
    return errors;
  }
}