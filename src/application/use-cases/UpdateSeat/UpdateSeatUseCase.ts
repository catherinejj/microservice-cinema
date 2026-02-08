import { Inject, Injectable } from "@nestjs/common";
import type { ISeatRepository } from "../../../domain/repositories";
import { UpdateSeatInput, UpdateSeatOutput } from "./UpdateSeatDTO";
import { UpdateSeatValidator } from "./UpdateSeatValidator";

@Injectable()
export class UpdateSeatUseCase {
  constructor(
    @Inject("ISeatRepository")
    private readonly seatRepository: ISeatRepository
  ) {}

  async execute(input: UpdateSeatInput): Promise<UpdateSeatOutput> {
    const errors = UpdateSeatValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const seat = await this.seatRepository.findById(input.id);
    if (!seat) throw new Error(`Seat with ID ${input.id} not found`);

    const newRow = input.row !== undefined ? input.row.trim().toUpperCase() : seat.row;
    const newNumber = input.number !== undefined ? input.number : seat.number;

    const wouldDuplicate = await this.seatRepository.existsInRoom(seat.roomId, newRow, newNumber);
    if (wouldDuplicate && (newRow !== seat.row || newNumber !== seat.number)) {
      throw new Error(`Seat already exists in room ${seat.roomId} at ${newRow}${newNumber}`);
    }

    const updated = (seat as any).constructor.create
      ? (seat as any).constructor.create({
          id: seat.id,
          roomId: seat.roomId,
          row: newRow,
          number: newNumber,
        })
      : seat;

    // Si Seat.create(...) statique => utiliser directement :
    // const updated = Seat.create({ id: seat.id, roomId: seat.roomId, row: newRow, number: newNumber });

    await this.seatRepository.update(updated);

    return { id: input.id };
  }
}