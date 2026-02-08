export class GetScreeningByIdInput {
  id: string;
}

export class GetScreeningByIdOutput {
  id: string;
  startsAt: Date;
  endsAt: Date;

  price: {
    amount: string;   // "11.00"
    currency: string; // "EUR"
  };

  movie: {
    id: string;
    title: string;
    duration: number;
    posterUrl?: string;
  };

  cinema: {
    id: string;
    name: string;
    city?: string;
    address?: string;
    zipCode?: string;
    phoneNumber?: string;
  };

  room: {
    id: string;
    name: string;
    capacitySeat: number;
  };
}