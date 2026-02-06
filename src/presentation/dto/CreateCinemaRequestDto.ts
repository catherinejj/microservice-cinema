import { ApiProperty } from "@nestjs/swagger";

export class CreateCinemaRequestDto {
  @ApiProperty({ example: "Cinéma Lumière" })
  name!: string;

  @ApiProperty({ example: "Aix-en-Provence", required: false })
  city?: string;

  @ApiProperty({ example: "12 rue des Écoles", required: false })
  address?: string;

  @ApiProperty({ example: "13100", required: false })
  zipCode?: string;

  @ApiProperty({ example: "0442000000", required: false })
  phoneNumber?: string;
}