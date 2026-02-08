import { ApiProperty } from "@nestjs/swagger";

export class CreateSeatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty()
  row: string;

  @ApiProperty()
  number: number;
}