import { Injectable } from "@nestjs/common";

@Injectable()
export class HttpMovieCatalogClient {
  private readonly baseUrl =
    process.env.MOVIE_SERVICE_URL ?? "http://localhost:3001";

  async getMovieById(movieId: string): Promise<Response> {
    const url = `${this.baseUrl}/movies/${movieId}`;
    //console.log("MOVIE URL =", url);

    return fetch(url, {
      headers: { accept: "application/json" },
    });
  }
}