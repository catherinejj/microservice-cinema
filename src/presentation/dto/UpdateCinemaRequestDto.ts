import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCinemaRequestDto {
  @ApiPropertyOptional({ example: "Nouveau nom" })
  name?: string;

  @ApiPropertyOptional({ example: "Paris", nullable: true })
  city?: string | null;
}