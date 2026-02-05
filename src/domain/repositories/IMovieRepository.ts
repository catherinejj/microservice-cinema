import { Movie } from "../entities/Movie";

export interface IMovieRepository {
  create(movie: Movie): Promise<void>;
  update(movie: Movie): Promise<void>;
  findById(id: string): Promise<Movie | null>;
  findByTitleAndReleaseDate(title: string, releaseDate: Date): Promise<Movie | null>;
  list(): Promise<Movie[]>;
}
