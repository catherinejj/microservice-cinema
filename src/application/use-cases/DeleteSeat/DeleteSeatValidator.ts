import { DeleteSeatInput } from "./DeleteSeatDto";

export class DeleteSeatValidator {
  static validate(input: DeleteSeatInput): string[] {
    const errors: string[] = [];
    if (!input.id) errors.push("id is required");
    return errors;
  }
}