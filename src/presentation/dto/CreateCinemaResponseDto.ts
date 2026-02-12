import { ApiProperty } from "@nestjs/swagger";

export class CreateCinemaResponseDto {
  @ApiProperty({ example: "cinema_1" })
  cinemaId!: string;
}
