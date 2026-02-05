import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { CreateRoomUseCase } from "../../application/use-cases/CreateRoom/CreateRoomUseCase";
import { ListRoomsByCinemaUseCase } from "../../application/use-cases/ListRoomsByCinema/ListRoomsByCinemaUseCase";

import { CreateRoomRequestDto } from "../dto/CreateRoomRequestDto";
import { CreateRoomResponseDto } from "../dto/CreateRoomResponseDto";
import { RoomResponseDto } from "../dto/RoomResponseDto";

@ApiTags("rooms")
@Controller("rooms")
export class RoomController {
  constructor(
    private readonly createRoom: CreateRoomUseCase,
    private readonly listRoomsByCinema: ListRoomsByCinemaUseCase
  ) {}

  // POST /rooms
  @Post()
  @ApiBody({ type: CreateRoomRequestDto })
  @ApiCreatedResponse({ type: CreateRoomResponseDto })
  async create(@Body() body: CreateRoomRequestDto): Promise<CreateRoomResponseDto> {
    // body est déjà conforme au CreateRoomInput (mêmes champs)
    return this.createRoom.execute(body);
  }

  // GET /rooms/cinema/:cinemaId
  @Get("cinema/:cinemaId")
  @ApiParam({ name: "cinemaId", type: String })
  @ApiOkResponse({ type: [RoomResponseDto] })
  async listByCinemaId(@Param("cinemaId") cinemaId: string): Promise<RoomResponseDto[]> {
    const result = await this.listRoomsByCinema.execute({ cinemaId });
    return result.rooms;
  }
}