export class CreateScreeningInput {
  movieId: string;
  roomId: string;
  startsAt: Date;

  extraMinutes?: number;

  basePrice: number;
  currency: string;
}

export class CreateScreeningOutput {
  id: string;
}