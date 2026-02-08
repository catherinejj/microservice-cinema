import { ApiProperty } from "@nestjs/swagger";

export class CreateScreeningRequestDto {
  @ApiProperty({ example: "movie_2" })
  movieId!: string;

  @ApiProperty({ example: "room_2" })
  roomId!: string;

  @ApiProperty({ example: "2026-02-08T18:00:00.000Z" })
  startsAt!: string;

  @ApiProperty({ example: 10, required: false, description: "Ads/Break duration in minutes" })
  extraMinutes?: number;

  @ApiProperty({ example: 11.0 })
  basePrice!: number;

  @ApiProperty({ example: "EUR" })
  currency!: string;
}