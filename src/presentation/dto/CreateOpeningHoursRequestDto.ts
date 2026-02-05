import { ApiProperty } from "@nestjs/swagger";
import { Weekday } from "../../domain/entities/OpeningHours";

export class CreateOpeningHoursRequestDto {
  @ApiProperty({ example: "ckv9x...cinemaId" })
  cinemaId: string;

  @ApiProperty({ enum: Weekday, example: Weekday.MON })
  day: Weekday;

  @ApiProperty({ example: "09:00" })
  openTime: string;

  @ApiProperty({ example: "18:00" })
  closeTime: string;

  @ApiProperty({ required: false, example: false })
  isClosed?: boolean;
}