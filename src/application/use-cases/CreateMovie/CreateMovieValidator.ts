import { CreateMovieInput } from "./CreateMovieDTO";

export class CreateMovieValidator {
  static validate(input: CreateMovieInput): string[] {
    const errors: string[] = [];

    if (!input.title || input.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (!input.description || input.description.trim().length === 0) {
      errors.push("Description is required");
    }

    if (!input.duration || input.duration <= 0) {
      errors.push("Duration must be greater than 0");
    }

    if (!input.category || input.category.trim().length === 0) {
      errors.push("Category is required");
    }

    if (!input.releaseDate || !(input.releaseDate instanceof Date)) {
      errors.push("Release date must be a valid Date");
    }

    if (input.rating < 0 || input.rating > 10) {
      errors.push("Rating must be between 0 and 10");
    }

    return errors;
  }
}
