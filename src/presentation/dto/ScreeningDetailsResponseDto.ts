import { ApiProperty } from "@nestjs/swagger";

class MoneyDto {
  @ApiProperty({ example: "11.00" })
  amount!: string;

  @ApiProperty({ example: "EUR" })
  currency!: string;
}

class MovieDto {
  @ApiProperty({ example: "movie_2" })
  id!: string;

  @ApiProperty({ example: "Blade Runner" })
  title!: string;

  @ApiProperty({ example: 117, description: "Duration in minutes" })
  duration!: number;

  @ApiProperty({ example: "https://..." , required: false })
  posterUrl?: string;
}

class CinemaDto {
  @ApiProperty({ example: "cinema_1" })
  id!: string;

  @ApiProperty({ example: "Cinéma Lumière" })
  name!: string;

  @ApiProperty({ example: "Aix-en-Provence", required: false })
  city?: string;

  @ApiProperty({ example: "12 rue ...", required: false })
  address?: string;

  @ApiProperty({ example: "13100", required: false })
  zipCode?: string;

  @ApiProperty({ example: "+33 4 00 00 00 00", required: false })
  phoneNumber?: string;
}

class RoomDto {
  @ApiProperty({ example: "room_2" })
  id!: string;

  @ApiProperty({ example: "Salle 2" })
  name!: string;

  @ApiProperty({ example: 20 })
  capacitySeat!: number;
}

export class ScreeningDetailsResponseDto {
  @ApiProperty({ example: "scr_123" })
  id!: string;

  @ApiProperty({ example: "2026-02-08T18:00:00.000Z" })
  startsAt!: string;

  @ApiProperty({ example: "2026-02-08T20:07:00.000Z" })
  endsAt!: string;

  @ApiProperty({ type: MoneyDto })
  price!: MoneyDto;

  @ApiProperty({ type: MovieDto })
  movie!: MovieDto;

  @ApiProperty({ type: CinemaDto })
  cinema!: CinemaDto;

  @ApiProperty({ type: RoomDto })
  room!: RoomDto;
}