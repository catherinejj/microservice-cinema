import { Injectable } from "@nestjs/common";

@Injectable()
export class HttpMovieCatalogClient {
  private readonly baseUrl = process.env.MOVIE_SERVICE_URL ?? "http://localhost:3001";

  async getMovieById(movieId: string): Promise<Response> {
    return fetch(`${this.baseUrl}/movies/${movieId}`, {
      headers: { accept: "application/json" },
    });
  }
}