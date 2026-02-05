import { ApiProperty } from "@nestjs/swagger";

export class CreateRoomRequestDto {
  @ApiProperty()
  cinemaId: string;

  @ApiProperty()
  roomName: string;

  @ApiProperty({ example: 80 })
  capacitySeat: number;
}