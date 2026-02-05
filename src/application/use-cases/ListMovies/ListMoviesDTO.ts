export class ListMoviesInput {
  // No input required
}

export class ListMoviesOutput {
  movies: {
    id: string;
    title: string;
    category: string;
    releaseDate: Date;
    rating: number;
  }[];
}
