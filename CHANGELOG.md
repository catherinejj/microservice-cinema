# Changelog

## v0.6.1
Maintenance:
  - Align Node/PostgreSQL/Prisma versions with production environment
  - Rename Swagger DTO class naming (DTO -> Dto) for consistency

## v0.6.0

- Screening feature extended:
  - New endpoint: GET /screenings/:id
  - Returns full aggregated screening details:
    - screening time slot
    - price
    - movie (title, duration, posterUrl) via external microservice
    - cinema information
    - room information

- New use-case:
  - GetScreeningByIdUseCase

- Microservices integration reinforced:
  - MovieCatalog used for runtime data enrichment
  - No local movie persistence

- API ready for frontend screening card display

## v0.5.0

- Security layer implemented:
  - AuthGuard
  - RolesGuard
  - Roles decorator
  - Admin-protected endpoints

- Full CRUD completed:
  - Cinema: update, delete
  - Room: update, delete
  - Seat: update, delete
  - Screening: update, delete
  - OpeningHours: update, delete

- Domain update:
  - Cinema extended with:
    - address
    - zipCode
    - phoneNumber

- Architecture refactor:
  - Movie removed from persistence layer
  - External movie microservice integration prepared
  - MovieCatalog service added

- Seed refactor:
  - Compatible with external movies
  - Dynamic screening end time based on movie duration

- Clean Architecture reinforced:
  - Guards in presentation layer
  - DTO consistency
  - Use-case isolation maintained

## v0.4.0
- Controllers layer implemented:
  - CinemaController (create, list, getById)
  - RoomController (create, list by cinema)
  - SeatController (generate, list by room, getById)
  - ScreeningController (create, list by room)
  - OpeningHoursController (create, list by cinema)

- New use-cases added:
  - GetCinemaById
  - GetOpeningHoursByCinema
  - ListSeatsByRoom
  - GetSeatById
  - ListRoomsByCinema
  - ListScreeningsByRoom

- Refactor:
  - Prisma cuid IDs fully integrated
  - Clean Architecture reinforced:
    - DTOs in application layer
    - DTOs in presentation layer
  - Modules wired with dependency injection
  - Swagger endpoints exposed

## v0.3.0
- Add NestJS modules structure
- Register modules in AppModule
- Prepare application layer for controllers

## v0.2.0
- Application layer:
  - Use-cases created:
    - CreateMovie
    - ListMovies
    - CreateCinema
    - AddRoomToCinema
    - GenerateSeatsForRoom
    - CreateScreening
- Infrastructure layer:
  - Prisma repositories implemented:
    - PrismaCinemaRepository
    - PrismaMovieRepository
    - PrismaRoomRepository
    - PrismaSeatRepository
    - PrismaScreeningRepository
  - Mapping implemented:
    - Prisma → Domain (rehydrate)
    - Domain → Prisma (create/update)
- Fixed multiple TypeScript errors:
  - private constructors usage
  - import type issues (NestJS metadata)
  - entity creation consistency

## v0.1.0
- Domain entities: Movie, Cinema, Room, Seat, Screening, OpeningHours
- Value objects: Money, TimeRange
- Repository interfaces in domain layer