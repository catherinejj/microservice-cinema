export class CreateMovieInput {
  title: string;
  description: string;
  duration: number; // minutes
  coverImage?: string;
  category: string;
  releaseDate: Date;
  rating: number;
}

export class CreateMovieOutput {
  movieId: string;
}
