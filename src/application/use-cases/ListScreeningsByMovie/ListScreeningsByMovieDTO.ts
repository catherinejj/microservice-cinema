import { ScreeningFilters } from "../../../domain/repositories/IScreeningRepository";

export type ListScreeningsByMovieDTO = { movieId: string } & ScreeningFilters;