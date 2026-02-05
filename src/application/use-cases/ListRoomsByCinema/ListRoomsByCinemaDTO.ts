export class ListRoomsByCinemaInput {
  cinemaId: string;
}

export class ListRoomsByCinemaOutput {
  rooms: Array<{
    id: string;
    cinemaId: string;
    name: string;
    capacitySeat: number;
  }>;
}