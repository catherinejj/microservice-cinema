import { Injectable, Inject } from "@nestjs/common";
import type { IRoomRepository, IScreeningRepository } from "../../../domain/repositories";
import type { IMovieCatalog } from "../../ports/IMovieCatalog";
import { Screening } from "../../../domain/entities/Screening";
import { Money } from "../../../domain/value-objects/Money";
import { TimeRange } from "../../../domain/value-objects/TimeRange";
import { CreateScreeningInput, CreateScreeningOutput } from "./CreateScreeningDTO";
import { CreateScreeningValidator } from "./CreateScreeningValidator";

import cuid from "cuid";

@Injectable()
export class CreateScreeningUseCase {
  constructor(
    @Inject("IMovieCatalog")
    private readonly movieCatalog: IMovieCatalog,

    @Inject("IRoomRepository")
    private readonly roomRepository: IRoomRepository,

    @Inject("IScreeningRepository")
    private readonly screeningRepository: IScreeningRepository
  ) {}

  async execute(input: CreateScreeningInput): Promise<CreateScreeningOutput> {
    const errors = CreateScreeningValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const movie = await this.movieCatalog.getSummary(input.movieId);
    if (!movie) throw new Error(`Movie with ID ${input.movieId} not found`);

    const room = await this.roomRepository.findById(input.roomId);
    if (!room) throw new Error(`Room with ID ${input.roomId} not found`);

    const slot = TimeRange.of(input.startsAt, input.endsAt);

    const hasOverlap = await this.screeningRepository.hasOverlap(input.roomId, slot);
    if (hasOverlap) {
      throw new Error(
        `Screening time slot overlaps with an existing screening in room ${input.roomId}`
      );
    }

    const screening = Screening.create({
      id: cuid(),
      movieId: input.movieId,
      roomId: input.roomId,
      slot,
      price: Money.fromDecimal(input.basePrice, input.currency),
    });

    await this.screeningRepository.create(screening);

    return { id: screening.id as string };
  }
}