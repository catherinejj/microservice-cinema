import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateOpeningHoursRequestDto {
  @ApiPropertyOptional({ example: "09:00" })
  openTime?: string;

  @ApiPropertyOptional({ example: "19:30" })
  closeTime?: string;

  @ApiPropertyOptional({ example: false })
  isClosed?: boolean;
}