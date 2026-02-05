import { ApiProperty } from "@nestjs/swagger";

export class RoomResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  cinemaId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  capacitySeat: number;
}