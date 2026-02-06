import { ApiProperty } from "@nestjs/swagger";

export class UpdateCinemaRequestDto {
  @ApiProperty({ example: "Nouveau nom", required: false })
  name?: string;

  @ApiProperty({ example: "Paris", required: false })
  city?: string;

  @ApiProperty({ example: "12 rue des Lilas", required: false })
  address?: string;

  @ApiProperty({ example: "75001", required: false })
  zipCode?: string;

  @ApiProperty({ example: "+33 6 12 34 56 78", required: false })
  phoneNumber?: string;
}