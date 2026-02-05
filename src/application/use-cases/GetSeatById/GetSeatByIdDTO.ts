export class GetSeatByIdInput {
  id: string;
}

export class GetSeatByIdOutput {
  seat: {
    id: string;
    roomId: string;
    row: string;
    number: number;
  } | null;
}