export class UpdateOpeningHoursInput {
  id: string;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
}

export class UpdateOpeningHoursOutput {
  id: string;
}