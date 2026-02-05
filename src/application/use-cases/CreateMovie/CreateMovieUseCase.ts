import { Injectable } from "@nestjs/common";
import type { IMovieRepository } from "../../../domain/repositories";
import { Movie } from "../../../domain/entities/Movie";
import { CreateMovieInput, CreateMovieOutput } from "./CreateMovieDTO";
import { CreateMovieValidator } from "./CreateMovieValidator";

@Injectable()
export class CreateMovieUseCase {
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute(input: CreateMovieInput): Promise<CreateMovieOutput> {
    const errors = CreateMovieValidator.validate(input);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(", ")}`);

    const movie = Movie.createNew({
      title: input.title,
      description: input.description,
      duration: input.duration,
      coverImage: input.coverImage,
      category: input.category,
      releaseDate: input.releaseDate,
      rating: input.rating,
    });

    const movieId = await this.movieRepository.create(movie);
    return { movieId };
  }
}