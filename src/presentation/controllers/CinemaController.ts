import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { CreateCinemaUseCase } from "../../application/use-cases/CreateCinema/CreateCinemaUseCase";
import { CreateCinemaRequestDto } from "../dto/CreateCinemaRequest";
import { CreateCinemaResponseDTO } from "../dto/CreateCinemaResponse";
import { ListCinemasUseCase } from "src/application/use-cases/ListCinemas/ListCinemasUseCase";

@ApiTags("cinemas")
@Controller("cinemas")
export class CinemaController {
  constructor(private readonly createCinema: CreateCinemaUseCase, private readonly listCinemas: ListCinemasUseCase,) {}

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
}