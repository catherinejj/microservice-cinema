import { Inject, Injectable } from "@nestjs/common";
import type { ICinemaRepository } from "../../../domain/repositories";
import { DeleteCinemaInput, DeleteCinemaOutput } from "./DeleteCinemaDTO";
import { DeleteCinemaValidator } from "./DeleteCinemaValidator";

@Injectable()
export class DeleteCinemaUseCase {
  constructor(
    @Inject("ICinemaRepository")
    private readonly cinemaRepository: ICinemaRepository
  ) {}

  async execute(input: DeleteCinemaInput): Promise<DeleteCinemaOutput> {
    const errors = DeleteCinemaValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    // option: check exist
    const cinema = await this.cinemaRepository.findById(input.id);
    if (!cinema) throw new Error(`Cinema with ID ${input.id} not found`);

    await this.cinemaRepository.delete(input.id);
    return { deleted: true };
  }
}