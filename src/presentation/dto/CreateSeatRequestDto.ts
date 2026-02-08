import { ApiProperty } from "@nestjs/swagger";

export class CreateSeatRequestDto {
  @ApiProperty()
  roomId: string;

  @ApiProperty()
  row: string;

  @ApiProperty()
  number: number;
}