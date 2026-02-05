import { GetSeatByIdInput } from "./GetSeatByIdDTO";

export class GetSeatByIdValidator {
  static validate(input: GetSeatByIdInput): string[] {
    const errors: string[] = [];
    if (!input.id) errors.push("id is required");
    return errors;
  }
}