import { ApiProperty } from "@nestjs/swagger";

export class DeleteCinemaResponseDto {
  @ApiProperty({ example: true })
  deleted: true;
}