import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { CreateOpeningHoursUseCase } from "../../application/use-cases/CreateOpeningHours/CreateOpeningHoursUseCase";
import { GetOpeningHoursByCinemaUseCase } from "../../application/use-cases/GetOpeningHoursByCinema/GetOpeningHoursByCinemaUseCase";
import { CreateOpeningHoursRequestDto } from "../dto/CreateOpeningHoursRequestDto";
import { CreateOpeningHoursResponseDto } from "../dto/CreateOpeningHoursResponseDto";
import { OpeningHoursResponseDto } from "../dto/OpeningHoursResponseDto";

@ApiTags("opening-hours")
@Controller("opening-hours")
export class OpeningHoursController {
  constructor(
    private readonly createOpeningHours: CreateOpeningHoursUseCase,
    private readonly getOpeningHoursByCinema: GetOpeningHoursByCinemaUseCase
  ) {}

  // POST /opening-hours
  @Post()
  @ApiBody({ type: CreateOpeningHoursRequestDto })
  @ApiCreatedResponse({ type: CreateOpeningHoursResponseDto })
  async create(
    @Body() body: CreateOpeningHoursRequestDto
  ): Promise<CreateOpeningHoursResponseDto> {
    return this.createOpeningHours.execute(body);
  }

  // GET /opening-hours/cinema/:cinemaId
  @Get("cinema/:cinemaId")
  @ApiParam({ name: "cinemaId", type: String })
  @ApiOkResponse({ type: [OpeningHoursResponseDto] })
  async listByCinemaId(
    @Param("cinemaId") cinemaId: string
  ): Promise<OpeningHoursResponseDto[]> {
    const result = await this.getOpeningHoursByCinema.execute({ cinemaId });
    return result.openingHours;
  }
}