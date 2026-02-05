export class GenerateSeatsForRoomRequestDto {
  roomId: string;
  rows: string[];       // ex ["A","B","C"]
  seatsPerRow: number;  // ex 12
}