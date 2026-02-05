import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { CreateScreeningUseCase } from "../../application/use-cases/CreateScreening/CreateScreeningUseCase";
import { ListScreeningsByRoomUseCase } from "../../application/use-cases/ListScreeningsByRoomUseCase/ListScreeningsByRoomUseCase";
import { CreateScreeningRequestDto } from "../dto/CreateScreeningRequestDto";

@ApiTags("screenings")
@Controller("screenings")
export class ScreeningController {
  constructor(
    private readonly createScreening: CreateScreeningUseCase,
    private readonly listByRoom: ListScreeningsByRoomUseCase
  ) {}

  @Post()
  @ApiBody({ type: CreateScreeningRequestDto })
  @ApiCreatedResponse({ description: "Screening created" })
  async create(@Body() body: CreateScreeningRequestDto) {
    return this.createScreening.execute({
      movieId: body.movieId,
      roomId: body.roomId,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
      basePrice: body.basePrice,
      currency: body.currency,
    });
  }

  @Get("room/:roomId")
  @ApiParam({ name: "roomId", type: String })
  @ApiOkResponse({ description: "List of screenings for a room" })
  async list(@Param("roomId") roomId: string) {
    return this.listByRoom.execute({ roomId }); // ✅ FIX
  }
}