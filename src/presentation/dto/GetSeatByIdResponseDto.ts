import { ApiProperty } from "@nestjs/swagger";

export class GetSeatByIdResponseDto {
  @ApiProperty({ nullable: true })
  seat:
    | {
        id: string;
        roomId: string;
        row: string;
        number: number;
      }
    | null;
}