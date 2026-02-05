import { Injectable } from "@nestjs/common";
import type { ICinemaRepository } from "../../../domain/repositories";
import { Cinema } from "../../../domain/entities/Cinema";
import { CreateCinemaInput, CreateCinemaOutput } from "./CreateCinemaDTO";
import { CreateCinemaValidator } from "./CreateCinemaValidator";

@Injectable()
export class CreateCinemaUseCase {
  constructor(private cinemaRepository: ICinemaRepository) {}

  async execute(input: CreateCinemaInput): Promise<CreateCinemaOutput> {
    const errors = CreateCinemaValidator.validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    const cinema = Cinema.create({
      id: `cin_${Date.now()}`,   // ou uuid si tu préfères
      name: input.name,
      city: input.city,
    });

    await this.cinemaRepository.create(cinema);

    return {
      cinemaId: cinema.id as string,
    };
  }
}
