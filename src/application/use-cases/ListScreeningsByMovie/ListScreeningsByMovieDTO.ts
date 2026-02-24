export type ListScreeningsByMovieDTO = {
  movieId: string;
  fromDate?: Date;
  toDate?: Date;
  hasAvailableSeats?: boolean;
};