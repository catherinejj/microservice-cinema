export class GenerateSeatsForRoomInput {
  roomId: string;
  rows: string[]; // e.g., ['A', 'B', 'C']
  seatsPerRow: number;
}

export class GenerateSeatsForRoomOutput {
  countCreated: number;
}
