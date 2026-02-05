export class CreateScreeningInput {
  movieId: string;
  roomId: string;
  startsAt: Date;
  extraMinutes: number; // additional time added to movie duration
  basePrice: number;
  currency: string;
}

export class CreateScreeningOutput {
  screeningId: string;
}
