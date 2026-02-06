// src/application/ports/IMovieCatalog.ts
import type { MovieSummaryDto } from "../services/MovieService/MovieSummaryDto";

export interface IMovieCatalog {
  getSummary(movieId: string): Promise<MovieSummaryDto | null>;
}