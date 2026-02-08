import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { CreateScreeningUseCase } from "../../application/use-cases/CreateScreening/CreateScreeningUseCase";
import { ListScreeningsByRoomUseCase } from "../../application/use-cases/ListScreeningsByRoomUseCase/ListScreeningsByRoomUseCase";
import { UpdateScreeningUseCase } from "../../application/use-cases/UpdateScreening/UpdateScreeningUseCase";
import { DeleteScreeningUseCase } from "../../application/use-cases/DeleteScreening/DeleteScreeningUseCase";
import { GetScreeningByIdUseCase } from "../../application/use-cases/GetScreeningDetailsById/GetScreeningByIdUseCase";

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
    private readonly getById: GetScreeningByIdUseCase
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

  @Get(":id")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: ScreeningDetailsResponseDto })
  async getScreeningById(@Param("id") id: string): Promise<ScreeningDetailsResponseDto> {
    const data = await this.getById.execute({ id });

    return {
      id: data.id,
      startsAt: data.startsAt.toISOString(),
      endsAt: data.endsAt.toISOString(),
      price: data.price,
      movie: data.movie,
      cinema: data.cinema,
      room: data.room,
    };
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