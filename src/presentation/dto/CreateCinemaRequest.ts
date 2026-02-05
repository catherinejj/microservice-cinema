import { ApiProperty } from "@nestjs/swagger";

export class CreateCinemaRequestDto {
  @ApiProperty({ example: "Cinéma Lumière" })
  name!: string;

  @ApiProperty({ example: "Aix-en-Provence", required: false })
  city?: string;
}