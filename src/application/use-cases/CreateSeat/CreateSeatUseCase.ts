import { Inject, Injectable } from "@nestjs/common";
import type { ISeatRepository, IRoomRepository } from "../../../domain/repositories";
import { Seat } from "../../../domain/entities/Seat";
import { CreateSeatInput, CreateSeatOutput } from "./CreateSeatDTO";
import { CreateSeatValidator } from "./CreateSeatValidator";

@Injectable()
export class CreateSeatUseCase {
  constructor(
    @Inject("ISeatRepository")
    private readonly seatRepo: ISeatRepository,

    @Inject("IRoomRepository")
    private readonly roomRepo: IRoomRepository
  ) {}

  async execute(input: CreateSeatInput): Promise<CreateSeatOutput> {
    const errors = CreateSeatValidator.validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    const room = await this.roomRepo.findById(input.roomId);
    if (!room) {
      throw new Error(`Room with ID ${input.roomId} not found`);
    }

    // Prisma génère l'id => Seat.id optional
    const seat = Seat.create({
      roomId: input.roomId,
      row: input.row,
      number: input.number,
    });

    const id = await this.seatRepo.create(seat);

    return { id };
  }
}