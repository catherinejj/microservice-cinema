import { Inject, Injectable } from "@nestjs/common";
import type { ICinemaRepository } from "../../../domain/repositories";
import { UpdateCinemaInput, UpdateCinemaOutput } from "./UpdateCinemaDto";
import { UpdateCinemaValidator } from "./UpdateCinemaValidator";

@Injectable()
export class UpdateCinemaUseCase {
  constructor(
    @Inject("ICinemaRepository")
    private readonly cinemaRepository: ICinemaRepository
  ) {}

  async execute(input: UpdateCinemaInput): Promise<UpdateCinemaOutput> {
    const errors = UpdateCinemaValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const cinema = await this.cinemaRepository.findById(input.id);
    if (!cinema) throw new Error(`Cinema with ID ${input.id} not found`);

    if (input.name !== undefined) cinema.rename(input.name);
    if (input.city !== undefined) cinema.moveToCity(input.city ?? undefined);
    if (input.address !== undefined) cinema.setAddress(input.address ?? undefined);
    if (input.zipCode !== undefined) cinema.setZipCode(input.zipCode ?? undefined);
    if (input.phoneNumber !== undefined) cinema.setPhoneNumber(input.phoneNumber ?? undefined);

    await this.cinemaRepository.update(cinema);

    return { id: cinema.id as string };
  }
}