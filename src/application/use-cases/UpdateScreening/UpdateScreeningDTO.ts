export class UpdateScreeningInput {
  id: string;

  startsAt?: Date;
  endsAt?: Date;

  basePrice?: number;
  currency?: string;
}

export class UpdateScreeningOutput {
  id: string;
}