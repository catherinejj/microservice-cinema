import { GetCinemaByIdInput } from "./GetCinemaByIdDTO";

export class GetCinemaByIdValidator {
  static validate(input: GetCinemaByIdInput): string[] {
    const errors: string[] = [];
    if (!input.id) errors.push("id is required");
    return errors;
  }
}