// src/application/services/movie/MovieCatalogService.ts
import { Injectable } from "@nestjs/common";
import type { IMovieCatalog } from "../../ports/IMovieCatalog";
import type { MovieSummaryDto } from "./MovieSummaryDto"
import type { MovieServiceResponseDto } from "./MovieServiceResponseDto";
import { HttpMovieCatalogClient } from "../../../infrastructure/http/clients/HttpMovieCatalogClient";

@Injectable()
export class MovieCatalogService implements IMovieCatalog {
  constructor(private readonly httpClient: HttpMovieCatalogClient) {}

  async getSummary(movieId: string): Promise<MovieSummaryDto | null> {
    const res = await this.httpClient.getMovieById(movieId);

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Movie service error ${res.status}`);

    const data = (await res.json()) as MovieServiceResponseDto;

    // validation minimale
    if (!data?.id || typeof data.duration !== "number") {
      throw new Error("Movie service: invalid response (id/duration missing)");
    }

    // mapping vers ton DTO "cinema needs"
    return {
      id: data.id,
      duration: data.duration,
      posterUrl: data.posterUrl,
    };
  }
}