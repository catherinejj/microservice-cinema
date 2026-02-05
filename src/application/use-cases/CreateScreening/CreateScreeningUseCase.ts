import { Injectable } from "@nestjs/common";
import type {
  IMovieRepository,
  IRoomRepository,
  IScreeningRepository,
} from "../../../domain/repositories";
import { Screening } from "../../../domain/entities/Screening";
import { Money } from "../../../domain/value-objects/Money";
import { TimeRange } from "../../../domain/value-objects/TimeRange";
import { CreateScreeningInput, CreateScreeningOutput } from "./CreateScreeningDTO";
import { CreateScreeningValidator } from "./CreateScreeningValidator";


@Injectable()
export class CreateScreeningUseCase {
  constructor(
    private movieRepository: IMovieRepository,
    private roomRepository: IRoomRepository,
    private screeningRepository: IScreeningRepository
  ) {}

  async execute(input: CreateScreeningInput): Promise<CreateScreeningOutput> {
    const errors = CreateScreeningValidator.validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    // Verify movie exists
    const movie = await this.movieRepository.findById(input.movieId);
    if (!movie) {
      throw new Error(`Movie with ID ${input.movieId} not found`);
    }

    // Verify room exists
    const room = await this.roomRepository.findById(input.roomId);
    if (!room) {
      throw new Error(`Room with ID ${input.roomId} not found`);
    }

    // Calculate screening end time
    const totalMinutes = movie.duration + input.extraMinutes;
    const endsAt = new Date(input.startsAt.getTime() + totalMinutes * 60000);

    // Create time slot
    const timeSlot = TimeRange.create(input.startsAt, endsAt);

    // Check for overlaps
    const hasOverlap = await this.screeningRepository.hasOverlap(
      input.roomId,
      timeSlot
    );
    if (hasOverlap) {
      throw new Error(
        `Screening time slot overlaps with an existing screening in room ${input.roomId}`
      );
    }

    // Create screening
    const price = Money.fromDecimal(input.basePrice, input.currency);
    const slot = TimeRange.of(input.startsAt, endsAt);

    const screening = Screening.create({
    id: `scr_${Date.now()}`,
    movieId: input.movieId,
    roomId: input.roomId,
    slot,
    price,
    });

    await this.screeningRepository.create(screening);

    return {
      screeningId: screening.id as string,
    };
  }
}
