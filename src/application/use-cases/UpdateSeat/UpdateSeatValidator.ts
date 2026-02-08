import { UpdateSeatInput } from "./UpdateSeatDTO";

export class UpdateSeatValidator {
  static validate(input: UpdateSeatInput): string[] {
    const errors: string[] = [];

    if (!input.id) errors.push("id is required");

    if (input.row === undefined && input.number === undefined) {
      errors.push("At least one field must be provided (row or number)");
    }

    if (input.row !== undefined && input.row.trim().length === 0) {
      errors.push("row cannot be empty");
    }

    if (input.number !== undefined) {
      if (!Number.isInteger(input.number) || input.number <= 0) {
        errors.push("number must be an integer > 0");
      }
    }

    return errors;
  }
}