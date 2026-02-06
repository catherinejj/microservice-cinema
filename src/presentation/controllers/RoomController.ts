import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { CreateRoomUseCase } from "../../application/use-cases/CreateRoom/CreateRoomUseCase";
import { ListRoomsByCinemaUseCase } from "../../application/use-cases/ListRoomsByCinema/ListRoomsByCinemaUseCase";
import { UpdateRoomUseCase } from "../../application/use-cases/UpdateRoom/UpdateRoomUseCase";
import { DeleteRoomUseCase } from "../../application/use-cases/DeleteRoom/DeleteRoomUseCase";

import { CreateRoomRequestDto } from "../dto/CreateRoomRequestDto";
import { CreateRoomResponseDto } from "../dto/CreateRoomResponseDto";
import { RoomResponseDto } from "../dto/RoomResponseDto";
import { UpdateRoomRequestDto } from "../dto/UpdateRoomRequestDto";
import { UpdateRoomResponseDto } from "../dto/UpdateRoomResponseDto";
import { DeleteRoomResponseDto } from "../dto/DeleteRoomResponseDto";

import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@ApiTags("rooms")
@Controller("rooms")
export class RoomController {
  constructor(
    private readonly createRoom: CreateRoomUseCase,
    private readonly listRoomsByCinema: ListRoomsByCinemaUseCase,
    private readonly updateRoom: UpdateRoomUseCase,
    private readonly deleteRoom: DeleteRoomUseCase
  ) {}


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBody({ type: CreateRoomRequestDto })
  @ApiCreatedResponse({ type: CreateRoomResponseDto })
  async create(@Body() body: CreateRoomRequestDto): Promise<CreateRoomResponseDto> {
    return this.createRoom.execute(body);
  }

  @Get("cinema/:cinemaId")
  @ApiParam({ name: "cinemaId", type: String })
  @ApiOkResponse({ type: [RoomResponseDto] })
  async listByCinemaId(@Param("cinemaId") cinemaId: string): Promise<RoomResponseDto[]> {
    const result = await this.listRoomsByCinema.execute({ cinemaId });
    return result.rooms;
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: UpdateRoomResponseDto })
  async update(
    @Param("id") id: string,
    @Body() body: UpdateRoomRequestDto
  ): Promise<UpdateRoomResponseDto> {
    return this.updateRoom.execute({ id, ...body });
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: DeleteRoomResponseDto })
  async remove(@Param("id") id: string): Promise<DeleteRoomResponseDto> {
    return this.deleteRoom.execute({ id });
  }
}