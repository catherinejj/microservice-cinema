import { UpdateScreeningInput } from "./UpdateScreeningDTO";

export class UpdateScreeningValidator {
  static validate(input: UpdateScreeningInput): string[] {
    const errors: string[] = [];

    if (!input.id) errors.push("id is required");

    const hasTime =
      input.startsAt !== undefined ||
      input.extraMinutes !== undefined;
    const hasPrice = input.basePrice !== undefined || input.currency !== undefined;

    if (!hasTime && !hasPrice) {
      errors.push("At least one field must be provided (time or price)");
    }

    if (input.startsAt && isNaN(input.startsAt.getTime())) errors.push("startsAt is invalid");
    if (input.extraMinutes !== undefined) {
      if (!Number.isInteger(input.extraMinutes) || input.extraMinutes < 0) {
        errors.push("extraMinutes must be an integer >= 0");
      }
    }

    if (input.basePrice !== undefined && typeof input.basePrice !== "number") {
      errors.push("basePrice must be a number");
    }

    if (input.currency !== undefined && input.currency.trim().length === 0) {
      errors.push("currency cannot be empty");
    }

    return errors;
  }
}
