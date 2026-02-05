import { ApiProperty } from "@nestjs/swagger";

export class CreateCinemaResponse {
  @ApiProperty({ example: "cinema_1" })
  cinemaId!: string;
}