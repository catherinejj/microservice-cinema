import { CreateRoomInput } from "./CreateRoomDto";

export class CreateRoomValidator {
  static validate(input: CreateRoomInput): string[] {
    const errors: string[] = [];
    if (!input.cinemaId) errors.push("cinemaId is required");
    if (!input.roomName || input.roomName.trim().length === 0) errors.push("roomName is required");
    if (!Number.isInteger(input.capacitySeat) || input.capacitySeat <= 0) {
      errors.push("capacitySeat must be an integer > 0");
    }
    return errors;
  }
}