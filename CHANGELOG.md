# Changelog

## v0.2.0
- Application layer implemented:
  - CreateCinemaUseCase
  - AddRoomToCinemaUseCase
  - GenerateSeatsForRoomUseCase
  - CreateMovieUseCase
  - ListMoviesUseCase
- Fixed entity instantiation via static factories (create())
- Fixed TypeScript decorator issues with `import type`
- Stabilized use-cases compilation

## v0.1.0
- Domain entities: Movie, Cinema, Room, Seat, Screening, OpeningHours
- Value objects: Money, TimeRange
- Repository interfaces in domain layer