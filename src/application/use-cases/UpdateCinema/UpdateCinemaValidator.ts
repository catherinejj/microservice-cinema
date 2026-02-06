import { UpdateCinemaInput } from "./UpdateCinemaDto";

export class UpdateCinemaValidator {
  static validate(input: UpdateCinemaInput): string[] {
    const errors: string[] = [];

    if (!input.id) errors.push("id is required");

    if (input.name !== undefined) {
      if (!input.name || input.name.trim().length === 0) {
        errors.push("name cannot be empty");
      }
    }

    return errors;
  }
}