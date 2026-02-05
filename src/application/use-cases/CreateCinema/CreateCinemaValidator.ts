import { CreateCinemaInput } from "./CreateCinemaDTO";

export class CreateCinemaValidator {
  static validate(input: CreateCinemaInput): string[] {
    const errors: string[] = [];

    if (!input.name || input.name.trim().length === 0) {
      errors.push("Cinema name is required");
    }

    return errors;
  }
}
