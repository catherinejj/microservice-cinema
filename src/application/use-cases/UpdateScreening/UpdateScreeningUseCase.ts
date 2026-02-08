import { Inject, Injectable } from "@nestjs/common";
import type { IScreeningRepository } from "../../../domain/repositories";
import { TimeRange } from "../../../domain/value-objects/TimeRange";
import { Money } from "../../../domain/value-objects/Money";
import { UpdateScreeningInput, UpdateScreeningOutput } from "./UpdateScreeningDTO";
import { UpdateScreeningValidator } from "./UpdateScreeningValidator";

@Injectable()
export class UpdateScreeningUseCase {
  constructor(
    @Inject("IScreeningRepository")
    private readonly screeningRepository: IScreeningRepository
  ) {}

  async execute(input: UpdateScreeningInput): Promise<UpdateScreeningOutput> {
    const errors = UpdateScreeningValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const screening = await this.screeningRepository.findById(input.id);
    if (!screening) throw new Error(`Screening with ID ${input.id} not found`);

    // --- reschedule ---
    if (input.startsAt !== undefined || input.endsAt !== undefined) {
      const newStartsAt = input.startsAt ?? screening.slot.start;
      const newEndsAt = input.endsAt ?? screening.slot.end;

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