import { BadRequestException } from "@nestjs/common";
import { ListMoviesByCinemaDTO } from "./ListMoviesByCinemaDTO";

export class ListMoviesByCinemaValidator {
  static validate(dto: ListMoviesByCinemaDTO) {
    if (!dto.cinemaId || dto.cinemaId.trim().length === 0) {
      throw new BadRequestException("cinemaId is required");
    }
  }
}