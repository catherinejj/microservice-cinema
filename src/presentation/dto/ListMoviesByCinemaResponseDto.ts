import { ApiProperty } from "@nestjs/swagger";

export class ListMoviesByCinemaResponseDto {
  @ApiProperty({ example: "movie_1" })
  id!: string;

  @ApiProperty({ example: "Inception" })
  title!: string;

  @ApiProperty({
    example: "https://image.tmdb.org/t/p/w500/inception.jpg",
    required: false,
  })
  posterUrl?: string;
}