import { UpdateOpeningHoursInput } from "./UpdateOpeningHoursDto";

export class UpdateOpeningHoursValidator {
  static validate(input: UpdateOpeningHoursInput): string[] {
    const errors: string[] = [];

    if (!input.id) errors.push("id is required");

    const hasAnyUpdate =
      input.openTime !== undefined ||
      input.closeTime !== undefined ||
      input.isClosed !== undefined;

    if (!hasAnyUpdate) errors.push("At least one field must be provided (openTime, closeTime, isClosed)");

    return errors;
  }
}