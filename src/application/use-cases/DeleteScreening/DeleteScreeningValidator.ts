import { DeleteScreeningInput } from "./DeleteScreeningDto";

export class DeleteScreeningValidator {
  static validate(input: DeleteScreeningInput): string[] {
    const errors: string[] = [];
    if (!input.id) errors.push("id is required");
    return errors;
  }
}