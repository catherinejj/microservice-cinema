import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateScreeningRequestDto {
  @ApiPropertyOptional({ example: "2026-02-06T18:00:00.000Z" })
  startsAt?: string;

  @ApiPropertyOptional({ example: 10, description: "Ads/Break duration in minutes" })
  extraMinutes?: number;

  @ApiPropertyOptional({ example: 9.5 })
  basePrice?: number;

  @ApiPropertyOptional({ example: "EUR" })
  currency?: string;
}
