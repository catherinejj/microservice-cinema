export class CreateCinemaInput {
  name: string;
  city?: string;
  address?: string;
  zipCode?: string;
  phoneNumber?: string;
}

export class CreateCinemaOutput {
  cinemaId: string;
}
