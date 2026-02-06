import { ApiProperty } from "@nestjs/swagger";

export class DeleteScreeningResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: true })
  deleted: boolean;
}