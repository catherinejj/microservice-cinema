import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateRoomRequestDto {
  @ApiPropertyOptional({ example: "Salle 2" })
  name?: string;

  @ApiPropertyOptional({ example: 120 })
  capacitySeat?: number;
}