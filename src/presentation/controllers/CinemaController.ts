import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { CreateCinemaUseCase } from "../../application/use-cases/CreateCinema/CreateCinemaUseCase";
import { ListCinemasUseCase } from "../../application/use-cases/ListCinemas/ListCinemasUseCase";
import { GetCinemaByIdUseCase } from "../../application/use-cases/GetCinemaById/GetCinemaByIdUseCase";
import { UpdateCinemaUseCase } from "../../application/use-cases/UpdateCinema/UpdateCinemaUseCase";
import { DeleteCinemaUseCase } from "../../application/use-cases/DeleteCinema/DeleteCinemaUseCase";

import { CreateCinemaRequestDto } from "../dto/CreateCinemaRequestDto";
import { CreateCinemaResponseDTO } from "../dto/CreateCinemaResponseDto";
import { GetCinemaByIdResponseDto } from "../dto/GetCinemaByIdResponseDto";
import { UpdateCinemaRequestDto } from "../dto/UpdateCinemaRequestDto";
import { UpdateCinemaResponseDto } from "../dto/UpdateCinemaResponseDto";
import { DeleteCinemaResponseDto } from "../dto/DeleteCinemaResponseDto";

import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@ApiTags("cinemas")
@Controller("cinemas")
export class CinemaController {
  constructor(
    private readonly createCinema: CreateCinemaUseCase,
    private readonly listCinemas: ListCinemasUseCase,
    private readonly getCinemaById: GetCinemaByIdUseCase,
    private readonly updateCinema: UpdateCinemaUseCase,
    private readonly deleteCinema: DeleteCinemaUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBody({ type: CreateCinemaRequestDto })
  @ApiCreatedResponse({ type: CreateCinemaResponseDTO })
  async create(@Body() body: CreateCinemaRequestDto): Promise<CreateCinemaResponseDTO> {
    return this.createCinema.execute(body);
  }

  @Get()
  @ApiOkResponse({ description: "List of cinemas" })
  async list() {
    return this.listCinemas.execute();
  }

  @Get(":id")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: GetCinemaByIdResponseDto })
  async getById(@Param("id") id: string): Promise<GetCinemaByIdResponseDto> {
    return this.getCinemaById.execute({ id });
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: UpdateCinemaResponseDto })
  async update(
    @Param("id") id: string,
    @Body() body: UpdateCinemaRequestDto
  ): Promise<UpdateCinemaResponseDto> {
    return this.updateCinema.execute({
      id,
      name: body.name,
      city: body.city,
    });
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: DeleteCinemaResponseDto })
  async remove(@Param("id") id: string): Promise<DeleteCinemaResponseDto> {
    return this.deleteCinema.execute({ id });
  }
}