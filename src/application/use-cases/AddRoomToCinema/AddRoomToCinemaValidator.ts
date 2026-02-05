import { AddRoomToCinemaInput } from "./AddRoomToCinemaDTO";

export class AddRoomToCinemaValidator {
  static validate(input: AddRoomToCinemaInput): string[] {
    const errors: string[] = [];

    if (!input.cinemaId || input.cinemaId.trim().length === 0) {
      errors.push("Cinema ID is required");
    }

    if (!input.roomName || input.roomName.trim().length === 0) {
      errors.push("Room name is required");
    }

    if (!input.capacitySeat || input.capacitySeat <= 0) {
      errors.push("Capacity must be greater than 0");
    }

    return errors;
  }
}
