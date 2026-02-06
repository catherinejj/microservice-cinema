import { UpdateRoomInput } from "./UpdateRoomDto";

export class UpdateRoomValidator {
  static validate(input: UpdateRoomInput): string[] {
    const errors: string[] = [];

    if (!input.id) errors.push("id is required");

    if (input.name === undefined && input.capacitySeat === undefined) {
      errors.push("At least one field must be provided (name or capacitySeat)");
    }

    if (input.name !== undefined && input.name.trim().length === 0) {
      errors.push("name cannot be empty");
    }

    if (input.capacitySeat !== undefined) {
      if (!Number.isInteger(input.capacitySeat) || input.capacitySeat <= 0) {
        errors.push("capacitySeat must be an integer > 0");
      }
    }

    return errors;
  }
}