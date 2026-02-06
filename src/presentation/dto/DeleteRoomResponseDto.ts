import { ApiProperty } from "@nestjs/swagger";

export class DeleteRoomResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: true })
  deleted: boolean;
}