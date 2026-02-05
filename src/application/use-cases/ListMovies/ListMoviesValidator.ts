import { ListMoviesInput } from "./ListMoviesDTO";

export class ListMoviesValidator {
  static validate(input: ListMoviesInput): string[] {
    const errors: string[] = [];
    // No validation needed for list operation
    return errors;
  }
}
