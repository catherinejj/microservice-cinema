import { ApiProperty } from "@nestjs/swagger";

export class DeleteSeatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: true })
  deleted: boolean;
}