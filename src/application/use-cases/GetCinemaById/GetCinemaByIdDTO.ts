export class GetCinemaByIdInput {
  id: string;
}

export class GetCinemaByIdOutput {
  cinema: {
    id: string;
    name: string;
    city?: string;
  } | null;
}