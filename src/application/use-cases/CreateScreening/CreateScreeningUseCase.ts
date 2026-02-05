import { Injectable, Inject } from "@nestjs/common";
import type { IScreeningRepository } from "../../../domain/repositories";
import { Screening } from "../../../domain/entities/Screening";
import { TimeRange } from "../../../domain/value-objects/TimeRange";
import { Money } from "../../../domain/value-objects/Money";

import { CreateScreeningInput, CreateScreeningOutput } from "./CreateScreeningDTO";
import { CreateScreeningValidator } from "./CreateScreeningValidator";

@Injectable()
export class CreateScreeningUseCase {
  constructor(
    @Inject("IScreeningRepository")
    private readonly screeningRepository: IScreeningRepository
  ) {}

  async execute(input: CreateScreeningInput): Promise<CreateScreeningOutput> {
    const errors = CreateScreeningValidator.validate(input);
    if (errors.length > 0) throw new Error(errors.join(", "));

    const screening = Screening.create({
      movieId: input.movieId,
      roomId: input.roomId,
      slot: TimeRange.create(input.startsAt, input.endsAt),
      price: Money.fromDecimal(input.basePrice, input.currency),

    });

    await this.screeningRepository.create(screening);

    return { id: "created" }; // Prisma repo pourra retourner l'id plus tard
  }
}