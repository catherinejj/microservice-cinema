export class CreateScreeningInput {
  movieId: string;
  roomId: string;
  startsAt: Date;
  endsAt: Date;
  basePrice: number;
  currency: string;
}

export class CreateScreeningOutput {
  id: string;
}