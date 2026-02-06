import { ApiProperty } from "@nestjs/swagger";

export class UpdateCinemaResponseDto {
  @ApiProperty({ example: "ckx..." })
  id: string;
}