import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

import { CreateScreeningUseCase } from "../../application/use-cases/CreateScreening/CreateScreeningUseCase";
import { ListScreeningsByRoomUseCase } from "../../application/use-cases/ListScreeningsByRoomUseCase/ListScreeningsByRoomUseCase";
import { UpdateScreeningUseCase } from "../../application/use-cases/UpdateScreening/UpdateScreeningUseCase";
import { DeleteScreeningUseCase } from "../../application/use-cases/DeleteScreening/DeleteScreeningUseCase";
import { GetScreeningByIdUseCase } from "../../application/use-cases/GetScreeningDetailsById/GetScreeningByIdUseCase";
import { ListScreeningsByMovieUseCase } from "../../application/use-cases/ListScreeningsByMovie/ListScreeningsByMovieUseCase";
import { ListAllScreeningsUseCase } from "../../application/use-cases/ListAllScreenings/ListAllScreeningsUseCase";

import { CreateScreeningRequestDto } from "../dto/CreateScreeningRequestDto";
import { UpdateScreeningRequestDto } from "../dto/UpdateScreeningRequestDto";
import { UpdateScreeningResponseDto } from "../dto/UpdateScreeningResponseDto";
import { DeleteScreeningResponseDto } from "../dto/DeleteScreeningResponseDto";
import { ScreeningDetailsResponseDto } from "../dto/ScreeningDetailsResponseDto";
import { ScreeningBookingResponseDto } from "../dto/ScreeningBookingResponseDto";

@ApiTags("screenings")
@Controller("screenings")
export class ScreeningController {
  constructor(
    private readonly createScreening: CreateScreeningUseCase,
    private readonly listByRoom: ListScreeningsByRoomUseCase,
    private readonly updateScreening: UpdateScreeningUseCase,
    private readonly deleteScreening: DeleteScreeningUseCase,
    private readonly getById: GetScreeningByIdUseCase,
    private readonly listAll: ListAllScreeningsUseCase,
    private readonly listByMovie: ListScreeningsByMovieUseCase
  ) {}

  @Post()
  @ApiBody({ type: CreateScreeningRequestDto })
  @ApiCreatedResponse({ description: "Screening created" })
  async create(@Body() body: CreateScreeningRequestDto) {
    return this.createScreening.execute({
      movieId: body.movieId,
      roomId: body.roomId,
      startsAt: new Date(body.startsAt),
      extraMinutes: body.extraMinutes,
      basePrice: body.basePrice,
      currency: body.currency,
    });
  }

  @Get()
  @ApiOkResponse({ type: [ScreeningDetailsResponseDto] })
  @ApiQuery({ name: "fromDate",          required: false, type: String,  example: "2026-02-25T00:00:00.000Z" })
  @ApiQuery({ name: "toDate",            required: false, type: String,  example: "2026-02-26T23:59:59.000Z" })
  @ApiQuery({ name: "hasAvailableSeats", required: false, type: Boolean, description: "true = places dispo, false = complet" })
  @ApiQuery({ name: "cinemaId",          required: false, type: String,  description: "Filtrer par ID cinéma" })
  @ApiQuery({ name: "cityName",          required: false, type: String,  example: "Paris", description: "Filtrer par ville (insensible à la casse)" })
  @ApiQuery({ name: "priceMax",          required: false, type: Number,  example: 12,     description: "Prix max en euros" })
  @ApiQuery({ name: "timeSlot",          required: false, enum: ["morning", "afternoon", "evening"], description: "morning=8-13h UTC, afternoon=13-17h UTC, evening=17-22h UTC" })
  @ApiQuery({ name: "sortBy",            required: false, enum: ["startsAt", "price"],   description: "Champ de tri" })
  @ApiQuery({ name: "sortOrder",         required: false, enum: ["asc", "desc"],          description: "Ordre de tri" })
  async listAllScreenings(
    @Query("fromDate")          fromDate?: string,
    @Query("toDate")            toDate?: string,
    @Query("hasAvailableSeats") hasAvailableSeats?: string,
    @Query("cinemaId")          cinemaId?: string,
    @Query("cityName")          cityName?: string,
    @Query("priceMax")          priceMax?: string,
    @Query("timeSlot")          timeSlot?: string,
    @Query("sortBy")            sortBy?: string,
    @Query("sortOrder")         sortOrder?: string,
  ): Promise<ScreeningDetailsResponseDto[]> {
    const list = await this.listAll.execute({
      fromDate:          fromDate  ? new Date(fromDate)  : undefined,
      toDate:            toDate    ? new Date(toDate)    : undefined,
      hasAvailableSeats: hasAvailableSeats === "true" ? true : hasAvailableSeats === "false" ? false : undefined,
      cinemaId:          cinemaId  || undefined,
      cityName:          cityName  || undefined,
      priceMax:          priceMax  ? parseFloat(priceMax) : undefined,
      timeSlot:          (timeSlot as any) || undefined,
      sortBy:            (sortBy as any)   || undefined,
      sortOrder:         (sortOrder as any) || undefined,
    });

    return list.map((data) => ({
      id: data.id,
      startsAt: data.startsAt.toISOString(),
      endsAt: data.endsAt.toISOString(),
      extraMinutes: data.extraMinutes,
      price: data.price,
      movie: data.movie,
      cinema: data.cinema,
      room: data.room,
    }));
  }

  @Get(":id")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: ScreeningDetailsResponseDto })
  async getScreeningById(@Param("id") id: string): Promise<ScreeningDetailsResponseDto> {
    const data = await this.getById.execute({ id });

    return {
      id: data.id,
      startsAt: data.startsAt.toISOString(),
      endsAt: data.endsAt.toISOString(),
      extraMinutes: data.extraMinutes,
      price: data.price,
      movie: data.movie,
      cinema: data.cinema,
      room: data.room,
    };
  }

  @Get("movie/:movieId")
  @ApiParam({ name: "movieId", type: String })
  @ApiOkResponse({ type: [ScreeningDetailsResponseDto] })
  @ApiQuery({ name: "fromDate",          required: false, type: String,  example: "2026-02-25T00:00:00.000Z" })
  @ApiQuery({ name: "toDate",            required: false, type: String,  example: "2026-02-26T23:59:59.000Z" })
  @ApiQuery({ name: "hasAvailableSeats", required: false, type: Boolean })
  @ApiQuery({ name: "cinemaId",          required: false, type: String })
  @ApiQuery({ name: "cityName",          required: false, type: String,  example: "Paris" })
  @ApiQuery({ name: "priceMax",          required: false, type: Number,  example: 12 })
  @ApiQuery({ name: "timeSlot",          required: false, enum: ["morning", "afternoon", "evening"] })
  @ApiQuery({ name: "sortBy",            required: false, enum: ["startsAt", "price"] })
  @ApiQuery({ name: "sortOrder",         required: false, enum: ["asc", "desc"] })
  async listByMovieId(
    @Param("movieId") movieId: string,
    @Query("fromDate")          fromDate?: string,
    @Query("toDate")            toDate?: string,
    @Query("hasAvailableSeats") hasAvailableSeats?: string,
    @Query("cinemaId")          cinemaId?: string,
    @Query("cityName")          cityName?: string,
    @Query("priceMax")          priceMax?: string,
    @Query("timeSlot")          timeSlot?: string,
    @Query("sortBy")            sortBy?: string,
    @Query("sortOrder")         sortOrder?: string,
  ): Promise<ScreeningDetailsResponseDto[]> {
    const list = await this.listByMovie.execute({
      movieId,
      fromDate:          fromDate  ? new Date(fromDate)  : undefined,
      toDate:            toDate    ? new Date(toDate)    : undefined,
      hasAvailableSeats: hasAvailableSeats === "true" ? true : hasAvailableSeats === "false" ? false : undefined,
      cinemaId:          cinemaId  || undefined,
      cityName:          cityName  || undefined,
      priceMax:          priceMax  ? parseFloat(priceMax) : undefined,
      timeSlot:          (timeSlot as any)   || undefined,
      sortBy:            (sortBy as any)     || undefined,
      sortOrder:         (sortOrder as any)  || undefined,
    });

    return list.map((data) => ({
      id: data.id,
      startsAt: data.startsAt.toISOString(),
      endsAt: data.endsAt.toISOString(),
      extraMinutes: data.extraMinutes,
      price: data.price,
      movie: data.movie,
      cinema: data.cinema,
      room: data.room,
    }));
  }

  @Get("room/:roomId")
  @ApiParam({ name: "roomId", type: String })
  @ApiOkResponse({ description: "List of screenings for a room" })
  async list(@Param("roomId") roomId: string) {
    return this.listByRoom.execute({ roomId });
  }

  @Get(":id/booking")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: ScreeningBookingResponseDto })
  async getForBooking(@Param("id") id: string): Promise<ScreeningBookingResponseDto> {
    const data = await this.getById.execute({ id });

    return {
      id: data.id,
      movieId: data.movie.id,
      roomId: data.room.id,
      cinemaId: data.cinema.id,
      startsAt: data.startsAt.toISOString(),
      endsAt: data.endsAt.toISOString(),
      price: {
        amount: Number(data.price.amount),
        currency: data.price.currency,
      },
    };
  }

  @Patch(":id")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: UpdateScreeningResponseDto })
  async update(
    @Param("id") id: string,
    @Body() body: UpdateScreeningRequestDto
  ): Promise<UpdateScreeningResponseDto> {
    return this.updateScreening.execute({
      id,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
      basePrice: body.basePrice,
      currency: body.currency,
    });
  }

  @Delete(":id")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: DeleteScreeningResponseDto })
  async remove(@Param("id") id: string): Promise<DeleteScreeningResponseDto> {
    return this.deleteScreening.execute({ id });
  }
}
