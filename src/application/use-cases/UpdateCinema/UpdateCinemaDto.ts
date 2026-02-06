export class UpdateCinemaInput {
  id: string;
  name?: string;
  city?: string | null; // null => effacer la ville
}

export class UpdateCinemaOutput {
  id: string;
}