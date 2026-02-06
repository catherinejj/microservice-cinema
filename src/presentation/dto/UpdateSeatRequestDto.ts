import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSeatRequestDto {
  @ApiPropertyOptional({ example: "A" })
  row?: string;

  @ApiPropertyOptional({ example: 12 })
  number?: number;
}