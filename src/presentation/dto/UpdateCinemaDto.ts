import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCinemaRequestDto {
  @ApiPropertyOptional({ example: "Nouveau nom" })
  name?: string;

  @ApiPropertyOptional({ example: "Marseille", nullable: true })
  city?: string | null;
}