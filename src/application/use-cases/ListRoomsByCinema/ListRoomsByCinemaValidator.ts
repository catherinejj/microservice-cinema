import { ListRoomsByCinemaInput } from "./ListRoomsByCinemaDTO";

export class ListRoomsByCinemaValidator {
  static validate(input: ListRoomsByCinemaInput): string[] {
    const errors: string[] = [];
    if (!input.cinemaId) errors.push("cinemaId is required");
    return errors;
  }
}