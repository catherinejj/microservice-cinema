import { ApiProperty } from "@nestjs/swagger";

export class ScreeningResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  movieId: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty()
  startsAt: Date;

  @ApiProperty()
  endsAt: Date;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  currency: string;
}