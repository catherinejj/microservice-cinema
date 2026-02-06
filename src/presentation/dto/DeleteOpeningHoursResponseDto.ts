import { ApiProperty } from "@nestjs/swagger";

export class DeleteOpeningHoursResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: true })
  deleted: boolean;
}