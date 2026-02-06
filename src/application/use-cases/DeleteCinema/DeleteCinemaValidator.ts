import { DeleteCinemaInput } from "./DeleteCinemaDto";

export class DeleteCinemaValidator {
  static validate(input: DeleteCinemaInput): string[] {
    const errors: string[] = [];
    if (!input.id) errors.push("id is required");
    return errors;
  }
}