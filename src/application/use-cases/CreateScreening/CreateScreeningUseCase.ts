import { Injectable, Inject } from "@nestjs/common";
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
    @Inject('IMovieRepository')
    private readonly movieRepository: IMovieRepository,

    @Inject('IRoomRepository')
    private readonly roomRepository: IRoomRepository,

    @Inject('IScreeningRepository')
    private readonly screeningRepository: IScreeningRepository
  ) {}

  async execute(input: CreateScreeningInput): Promise<CreateScreeningOutput> {
    const errors = CreateScreeningValidator.validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    const movie = await this.movieRepository.findById(input.movieId);
    if (!movie) {
      throw new Error(`Movie with ID ${input.movieId} not found`);
    }

    const room = await this.roomRepository.findById(input.roomId);
    if (!room) {
      throw new Error(`Room with ID ${input.roomId} not found`);
    }

    const totalMinutes = movie.duration + input.extraMinutes;
    const endsAt = new Date(input.startsAt.getTime() + totalMinutes * 60000);

    const slot = TimeRange.of(input.startsAt, endsAt);

    const hasOverlap = await this.screeningRepository.hasOverlap(
      input.roomId,
      slot
    );

    if (hasOverlap) {
      throw new Error(
        `Screening time slot overlaps with an existing screening in room ${input.roomId}`
      );
    }

    const price = Money.fromDecimal(input.basePrice, input.currency);

    const screening = Screening.create({
      id: "",
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