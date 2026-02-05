export class AddRoomToCinemaInput {
  cinemaId: string;
  roomName: string;
  capacitySeat: number;
}

export class AddRoomToCinemaOutput {
  roomId: string;
}
