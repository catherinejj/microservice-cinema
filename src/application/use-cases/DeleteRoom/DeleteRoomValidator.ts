import { DeleteRoomInput } from "./DeleteRoomDTO";

export class DeleteRoomValidator {
  static validate(input: DeleteRoomInput): string[] {
    const errors: string[] = [];
    if (!input.id) errors.push("id is required");
    return errors;
  }
}