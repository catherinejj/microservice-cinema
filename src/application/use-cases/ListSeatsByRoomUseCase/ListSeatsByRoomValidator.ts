import { ListSeatsByRoomInput } from "./ListSeatsByRoomDTO";

export class ListSeatsByRoomValidator {
  static validate(input: ListSeatsByRoomInput): string[] {
    const errors: string[] = [];
    if (!input.roomId) errors.push("roomId is required");
    return errors;
  }
}