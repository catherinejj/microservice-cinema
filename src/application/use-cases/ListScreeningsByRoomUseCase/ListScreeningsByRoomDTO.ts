export class ListScreeningsByRoomInput {
  roomId: string;
}

export class ListScreeningsByRoomOutput {
  screenings: Array<{
    id: string;
    roomId: string;
    movieId: string;
    startsAt: Date;
    endsAt: Date;
    basePrice: number;
    currency: string;
  }>;
}