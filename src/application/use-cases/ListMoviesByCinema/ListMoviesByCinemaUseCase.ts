import { Injectable, Inject } from "@nestjs/common";
import type { IScreeningRepository } from "../../../domain/repositories";
import { MovieCatalogService } from "../../services/MovieService/MovieCatalogService";
import { ListMoviesByCinemaDTO } from "./ListMoviesByCinemaDTO";
import { ListMoviesByCinemaValidator } from "./ListMoviesByCinemaValidator";
import type { MovieSummaryDto } from "../../services/MovieService/MovieSummaryDto";

@Injectable()
export class ListMoviesByCinemaUseCase {
  constructor(
    @Inject("IScreeningRepository") private readonly screeningRepo: IScreeningRepository,
    private readonly movieCatalog: MovieCatalogService
  ) {}

  async execute(dto: ListMoviesByCinemaDTO): Promise<MovieSummaryDto[]> {
    ListMoviesByCinemaValidator.validate(dto);

    const movieIds = await this.screeningRepo.findMovieIdsByCinemaId(dto.cinemaId);

    // Appels au movie-service pour enrichir : title / posterUrl / duration...
    const movies = await Promise.all(movieIds.map((id) => this.movieCatalog.getSummary(id)));

    // getSummary peut potentiellement throw si movieId invalide ; ici on filtre les null si jamais
    return movies.filter((m): m is MovieSummaryDto => !!m);
  }
}