import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { GenerateSeatsForRoomUseCase } from "../../application/use-cases/GenerateSeatsForRoom/GenerateSeatsForRoomUseCase";
import { ListSeatsByRoomUseCase } from "../../application/use-cases/ListSeatsByRoomUseCase/ListSeatsByRoomUseCase";
import { GetSeatByIdUseCase } from "../../application/use-cases/GetSeatById/GetSeatByIdUseCase";
import { GetSeatByIdResponseDto } from "../dto/GetSeatByIdResponseDto";
import { GenerateSeatsForRoomRequestDto } from "../dto/GenerateSeatsForRoomRequestDto";
import { GenerateSeatsForRoomResponseDto } from "../dto/GenerateSeatsForRoomResponseDto";
import { SeatResponseDto } from "../dto/SeatResponseDto";

@ApiTags("seats")
@Controller("seats")
export class SeatController {
  constructor(
    private readonly generateSeats: GenerateSeatsForRoomUseCase,
    private readonly listByRoom: ListSeatsByRoomUseCase,
    private readonly getSeatById: GetSeatByIdUseCase
  ) {}

  // POST /seats/generate
  @Post("generate")
  @ApiBody({ type: GenerateSeatsForRoomRequestDto })
  @ApiOkResponse({ type: GenerateSeatsForRoomResponseDto })
  async generate(@Body() body: GenerateSeatsForRoomRequestDto): Promise<GenerateSeatsForRoomResponseDto> {
    return this.generateSeats.execute({
      roomId: body.roomId,
      rows: body.rows,
      seatsPerRow: body.seatsPerRow,
    });
  }

  // GET /seats/room/:roomId
  @Get("room/:roomId")
  @ApiParam({ name: "roomId", type: String })
  @ApiOkResponse({ type: [SeatResponseDto] })
  async list(@Param("roomId") roomId: string): Promise<SeatResponseDto[]> {
    const result = await this.listByRoom.execute({ roomId });
    return result.seats;
  }

  // GET /seats/:id
  @Get(":id")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: GetSeatByIdResponseDto })
  async getById(@Param("id") id: string): Promise<GetSeatByIdResponseDto> {
    return this.getSeatById.execute({ id });
  }
}