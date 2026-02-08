import { ApiProperty } from "@nestjs/swagger";

class PriceDto {
  @ApiProperty({ example: 11.0 })
  amount!: number;

  @ApiProperty({ example: "EUR" })
  currency!: string;
}

export class ScreeningBookingResponseDto {
  @ApiProperty({ example: "scr_123" })
  id!: string;

  @ApiProperty({ example: "movie_2" })
  movieId!: string;

  @ApiProperty({ example: "room_2" })
  roomId!: string;

  @ApiProperty({ example: "cinema_1" })
  cinemaId!: string;

  @ApiProperty({ example: "2026-02-08T18:00:00.000Z" })
  startsAt!: string;

  @ApiProperty({ example: "2026-02-08T20:07:00.000Z" })
  endsAt!: string;

  @ApiProperty({ type: PriceDto })
  price!: PriceDto;
}