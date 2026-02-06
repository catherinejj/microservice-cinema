import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateScreeningRequestDto {
  @ApiPropertyOptional({ example: "2026-02-06T18:00:00.000Z" })
  startsAt?: string;

  @ApiPropertyOptional({ example: "2026-02-06T20:15:00.000Z" })
  endsAt?: string;

  @ApiPropertyOptional({ example: 9.5 })
  basePrice?: number;

  @ApiPropertyOptional({ example: "EUR" })
  currency?: string;
}