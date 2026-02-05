import { ApiProperty } from "@nestjs/swagger";

export class CreateScreeningResponseDto {
  @ApiProperty()
  id: string;
}