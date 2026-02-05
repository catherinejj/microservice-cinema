import { Injectable, Inject } from "@nestjs/common";
import type { ICinemaRepository } from "../../../domain/repositories";

@Injectable()
export class ListCinemasUseCase {
  constructor(
    @Inject('ICinemaRepository')
    private readonly cinemaRepository: ICinemaRepository
  ) {}

  async execute() {
    return this.cinemaRepository.list();
  }
}