import { DeleteOpeningHoursInput } from "./DeleteOpeningHoursDto";

export class DeleteOpeningHoursValidator {
  static validate(input: DeleteOpeningHoursInput): string[] {
    const errors: string[] = [];
    if (!input.id) errors.push("id is required");
    return errors;
  }
}