import { Injectable, Inject } from "@nestjs/common";
import type { ICinemaRepository } from "../../../domain/repositories";
import { GetCinemaByIdInput, GetCinemaByIdOutput } from "./GetCinemaByIdDTO";
import { GetCinemaByIdValidator } from "./GetCinemaByIdValidator";

@Injectable()
export class GetCinemaByIdUseCase {
  constructor(
    @Inject("ICinemaRepository")
    private readonly cinemaRepository: ICinemaRepository
  ) {}

  async execute(input: GetCinemaByIdInput): Promise<GetCinemaByIdOutput> {
    const errors = GetCinemaByIdValidator.validate(input);
    if (errors.length > 0) throw new Error(errors.join(", "));

    const cinema = await this.cinemaRepository.findById(input.id);

    if (!cinema) {
      return { cinema: null };
    }

    return {
      cinema: {
        id: cinema.id!,
        name: cinema.name,
        city: cinema.city,
      },
    };
  }
}