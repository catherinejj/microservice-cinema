import { GenerateSeatsForRoomInput } from "./GenerateSeatsForRoomDTO";

export class GenerateSeatsForRoomValidator {
  static validate(input: GenerateSeatsForRoomInput): string[] {
    const errors: string[] = [];

    if (!input.roomId || input.roomId.trim().length === 0) {
      errors.push("Room ID is required");
    }

    if (!input.rows || input.rows.length === 0) {
      errors.push("At least one row is required");
    }

    if (!input.seatsPerRow || input.seatsPerRow <= 0) {
      errors.push("Seats per row must be greater than 0");
    }

    return errors;
  }
}
