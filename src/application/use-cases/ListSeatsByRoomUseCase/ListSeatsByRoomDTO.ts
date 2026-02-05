export class ListSeatsByRoomInput {
  roomId: string;
}

export class ListSeatsByRoomOutput {
  seats: Array<{
    id: string;
    roomId: string;
    row: string;
    number: number;
  }>;
}