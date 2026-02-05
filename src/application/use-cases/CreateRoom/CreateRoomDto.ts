export class CreateRoomInput {
  cinemaId: string;
  roomName: string;
  capacitySeat: number;
}

export class CreateRoomOutput {
  roomId: string;
}