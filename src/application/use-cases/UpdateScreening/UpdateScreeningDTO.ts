export class UpdateScreeningInput {
  id: string;

  startsAt?: Date;
  extraMinutes?: number;

  basePrice?: number;
  currency?: string;
}

export class UpdateScreeningOutput {
  id: string;
}
