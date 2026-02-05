import { ApiProperty } from "@nestjs/swagger";

export class CreateCinemaResponseDTO {
  @ApiProperty({ example: "cinema_1" })
  cinemaId!: string;
}