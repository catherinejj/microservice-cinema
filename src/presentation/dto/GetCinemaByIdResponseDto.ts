import { ApiProperty } from "@nestjs/swagger";

export class GetCinemaByIdResponseDto {
  @ApiProperty({ nullable: true })
  cinema:
    | {
        id: string;
        name: string;
        city?: string;
      }
    | null;
}