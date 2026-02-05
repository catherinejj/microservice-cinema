import { Injectable, Inject } from "@nestjs/common";
import type { IMovieRepository } from "../../../domain/repositories";
import { ListMoviesInput, ListMoviesOutput } from "./ListMoviesDTO";
import { ListMoviesValidator } from "./ListMoviesValidator";

@Injectable()
export class ListMoviesUseCase {
  constructor(
    @Inject('IMovieRepository')
    private readonly movieRepository: IMovieRepository
  ) {}

  async execute(input: ListMoviesInput): Promise<ListMoviesOutput> {
    const errors = ListMoviesValidator.validate(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    const movies = await this.movieRepository.list();

    return {
      movies: movies.map((movie) => ({
        id: movie.id as string,
        title: movie.title,
        category: movie.category,
        releaseDate: movie.releaseDate,
        rating: movie.rating,
      })),
    };
  }
}