import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { GetSeatByIdUseCase } from "../../application/use-cases/GetSeatById/GetSeatByIdUseCase";
import { ListSeatsByRoomUseCase } from "../../application/use-cases/ListSeatsByRoomUseCase/ListSeatsByRoomUseCase";
import { UpdateSeatUseCase } from "../../application/use-cases/UpdateSeat/UpdateSeatUseCase";
import { DeleteSeatUseCase } from "../../application/use-cases/DeleteSeat/DeleteSeatUseCase";
import { CreateSeatUseCase } from "../../application/use-cases/CreateSeat/CreateSeatUseCase";

import { UpdateSeatRequestDto } from "../dto/UpdateSeatRequestDto";
import { UpdateSeatResponseDto } from "../dto/UpdateSeatResponseDto";
import { DeleteSeatResponseDto } from "../dto/DeleteSeatResponseDto";
import { CreateSeatRequestDto } from "../dto/CreateSeatRequestDto";
import { CreateSeatResponseDto } from "../dto/CreateSeatResponseDto";

import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@ApiTags("seats")
@Controller("seats")
export class SeatController {
  constructor(
    private readonly getSeatById: GetSeatByIdUseCase,
    private readonly listSeatsByRoom: ListSeatsByRoomUseCase,
    private readonly updateSeat: UpdateSeatUseCase,
    private readonly deleteSeat: DeleteSeatUseCase,
    private readonly createSeat: CreateSeatUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBody({ type: CreateSeatRequestDto })
  @ApiCreatedResponse({ type: CreateSeatResponseDto })
  async create(@Body() body: CreateSeatRequestDto): Promise<CreateSeatResponseDto> {
    const out = await this.createSeat.execute({
      roomId: body.roomId,
      row: body.row,
      number: body.number,
    });

    return { id: out.id, roomId: body.roomId, row: body.row, number: body.number };
  }

  @Get(":id")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ description: "Seat details" })
  async getById(@Param("id") id: string) {
    return this.getSeatById.execute({ id });
  }

  @Get("room/:roomId")
  @ApiParam({ name: "roomId", type: String })
  @ApiOkResponse({ description: "Seats for a room" })
  async listByRoom(@Param("roomId") roomId: string) {
    return this.listSeatsByRoom.execute({ roomId });
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSeatRequestDto })
  @ApiOkResponse({ type: UpdateSeatResponseDto })
  async updateOne(
    @Param("id") id: string,
    @Body() body: UpdateSeatRequestDto
  ): Promise<UpdateSeatResponseDto> {
    return this.updateSeat.execute({
      id,
      row: body.row,
      number: body.number,
    });
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: DeleteSeatResponseDto })
  async remove(@Param("id") id: string): Promise<DeleteSeatResponseDto> {
    return this.deleteSeat.execute({ id });
  }
}