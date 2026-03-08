import { Inject, Injectable } from "@nestjs/common";
import type { IScreeningRepository } from "../../../domain/repositories";
import type { IMovieCatalog } from "../../ports/IMovieCatalog";
import { TimeRange } from "../../../domain/value-objects/TimeRange";
import { Money } from "../../../domain/value-objects/Money";
import { UpdateScreeningInput, UpdateScreeningOutput } from "./UpdateScreeningDTO";
import { UpdateScreeningValidator } from "./UpdateScreeningValidator";

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

@Injectable()
export class UpdateScreeningUseCase {
  constructor(
    @Inject("IMovieCatalog")
    private readonly movieCatalog: IMovieCatalog,

    @Inject("IScreeningRepository")
    private readonly screeningRepository: IScreeningRepository
  ) {}

  async execute(input: UpdateScreeningInput): Promise<UpdateScreeningOutput> {
    const errors = UpdateScreeningValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const screening = await this.screeningRepository.findById(input.id);
    if (!screening) throw new Error(`Screening with ID ${input.id} not found`);

    // --- reschedule ---
    const shouldRecomputeEnd =
      input.startsAt !== undefined || input.extraMinutes !== undefined;
    if (shouldRecomputeEnd) {
      const newStartsAt = input.startsAt ?? screening.slot.start;
      const newExtraMinutes = input.extraMinutes ?? screening.extraMinutes;
      const movie = await this.movieCatalog.getSummary(screening.movieId);
      if (!movie) throw new Error(`Movie with ID ${screening.movieId} not found`);
      const newEndsAt = addMinutes(newStartsAt, movie.duration + newExtraMinutes);

      const newSlot = TimeRange.of(newStartsAt, newEndsAt);

      const hasOverlap = await this.screeningRepository.hasOverlap(
        screening.roomId,
        newSlot,
        screening.id // exclude current
      );
      if (hasOverlap) {
        throw new Error(`New time slot overlaps with existing screening in room ${screening.roomId}`);
      }

      screening.reschedule(newSlot);
      if (input.extraMinutes !== undefined) {
        screening.changeExtraMinutes(input.extraMinutes);
      }
    }

    // --- price ---
    if (input.basePrice !== undefined || input.currency !== undefined) {
      const newAmount = input.basePrice ?? screening.price.amount;
      const newCurrency = input.currency ?? screening.price.currency;
      screening.changePrice(Money.fromDecimal(newAmount, newCurrency));
    }

    await this.screeningRepository.update(screening);

    return { id: input.id };
  }
}
