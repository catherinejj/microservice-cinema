import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { CreateCinemaUseCase } from "../../application/use-cases/CreateCinema/CreateCinemaUseCase";
import { CreateCinemaRequestDto } from "../dto/CreateCinemaRequestDto";
import { CreateCinemaResponseDTO } from "../dto/CreateCinemaResponseDto";
import { ListCinemasUseCase } from "src/application/use-cases/ListCinemas/ListCinemasUseCase";

import { GetCinemaByIdUseCase } from "../../application/use-cases/GetCinemaById/GetCinemaByIdUseCase";
import { GetCinemaByIdResponseDto } from "../dto/GetCinemaByIdResponseDto";

@ApiTags("cinemas")
@Controller("cinemas")
export class CinemaController {
  constructor(private readonly createCinema: CreateCinemaUseCase, private readonly listCinemas: ListCinemasUseCase,private readonly getCinemaById: GetCinemaByIdUseCase,) {}

  @Post()
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
  async getById(
    @Param("id") id: string
  ): Promise<GetCinemaByIdResponseDto> {
    return this.getCinemaById.execute({ id });
  }
}