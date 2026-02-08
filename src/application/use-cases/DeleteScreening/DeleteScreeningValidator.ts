import { DeleteScreeningInput } from "./DeleteScreeningDTO";

export class DeleteScreeningValidator {
  static validate(input: DeleteScreeningInput): string[] {
    const errors: string[] = [];
    if (!input.id) errors.push("id is required");
    return errors;
  }
}