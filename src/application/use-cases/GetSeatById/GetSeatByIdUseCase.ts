import { Injectable, Inject } from "@nestjs/common";
import type { ISeatRepository } from "../../../domain/repositories";
import { GetSeatByIdInput, GetSeatByIdOutput } from "./GetSeatByIdDTO";
import { GetSeatByIdValidator } from "./GetSeatByIdValidator";

@Injectable()
export class GetSeatByIdUseCase {
  constructor(
    @Inject("ISeatRepository")
    private readonly seatRepository: ISeatRepository
  ) {}

  async execute(input: GetSeatByIdInput): Promise<GetSeatByIdOutput> {
    const errors = GetSeatByIdValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const seat = await this.seatRepository.findById(input.id);

    if (!seat) return { seat: null };

    return {
      seat: {
        id: seat.id!, // après DB Prisma a généré le cuid
        roomId: seat.roomId,
        row: seat.row,
        number: seat.number,
      },
    };
  }
}