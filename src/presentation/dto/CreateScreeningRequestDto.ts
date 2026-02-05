import { ApiProperty } from "@nestjs/swagger";

export class CreateScreeningRequestDto {
  @ApiProperty()
  movieId: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty({ example: "2026-02-05T18:00:00.000Z" })
  startsAt: string;

  @ApiProperty({ example: "2026-02-05T20:00:00.000Z" })
  endsAt: string;

  @ApiProperty({ example: 9.99 })
  basePrice: number;

  @ApiProperty({ example: "EUR" })
  currency: string;
}