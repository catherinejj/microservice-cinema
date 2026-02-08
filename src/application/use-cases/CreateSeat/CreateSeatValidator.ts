import { CreateSeatInput } from "./CreateSeatDTO";

export class CreateSeatValidator {
  static validate(input: CreateSeatInput): string[] {
    const errors: string[] = [];

    if (!input.roomId || input.roomId.trim().length === 0) {
      errors.push("roomId is required");
    }

    if (!input.row || input.row.trim().length === 0) {
      errors.push("row is required");
    }

    if (!Number.isInteger(input.number) || input.number <= 0) {
      errors.push("number must be an integer > 0");
    }

    return errors;
  }
}