import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoomResponseDto {
  @ApiProperty()
  id: string;
}