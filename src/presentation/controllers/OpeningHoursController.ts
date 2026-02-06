import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { CreateOpeningHoursUseCase } from "../../application/use-cases/CreateOpeningHours/CreateOpeningHoursUseCase";
import { GetOpeningHoursByCinemaUseCase } from "../../application/use-cases/GetOpeningHoursByCinema/GetOpeningHoursByCinemaUseCase";
import { UpdateOpeningHoursUseCase } from "../../application/use-cases/UpdateOpeningHours/UpdateOpeningHoursUseCase";
import { DeleteOpeningHoursUseCase } from "../../application/use-cases/DeleteOpeningHours/DeleteOpeningHoursUseCase";

import { CreateOpeningHoursRequestDto } from "../dto/CreateOpeningHoursRequestDto";
import { CreateOpeningHoursResponseDto } from "../dto/CreateOpeningHoursResponseDto";
import { OpeningHoursResponseDto } from "../dto/OpeningHoursResponseDto";
import { UpdateOpeningHoursRequestDto } from "../dto/UpdateOpeningHoursRequestDto";
import { UpdateOpeningHoursResponseDto } from "../dto/UpdateOpeningHoursResponseDto";
import { DeleteOpeningHoursResponseDto } from "../dto/DeleteOpeningHoursResponseDto";

import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@ApiTags("opening-hours")
@Controller("opening-hours")
export class OpeningHoursController {
  constructor(
    private readonly createOpeningHours: CreateOpeningHoursUseCase,
    private readonly getOpeningHoursByCinema: GetOpeningHoursByCinemaUseCase,
    private readonly updateOpeningHours: UpdateOpeningHoursUseCase,
    private readonly deleteOpeningHours: DeleteOpeningHoursUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBody({ type: CreateOpeningHoursRequestDto })
  @ApiCreatedResponse({ type: CreateOpeningHoursResponseDto })
  async create(@Body() body: CreateOpeningHoursRequestDto): Promise<CreateOpeningHoursResponseDto> {
    return this.createOpeningHours.execute(body);
  }

  @Get("cinema/:cinemaId")
  @ApiParam({ name: "cinemaId", type: String })
  @ApiOkResponse({ type: [OpeningHoursResponseDto] })
  async listByCinemaId(@Param("cinemaId") cinemaId: string): Promise<OpeningHoursResponseDto[]> {
    const result = await this.getOpeningHoursByCinema.execute({ cinemaId });
    return result.openingHours;
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: UpdateOpeningHoursResponseDto })
  async update(
    @Param("id") id: string,
    @Body() body: UpdateOpeningHoursRequestDto
  ): Promise<UpdateOpeningHoursResponseDto> {
    return this.updateOpeningHours.execute({ id, ...body });
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "id", type: String })
  @ApiOkResponse({ type: DeleteOpeningHoursResponseDto })
  async remove(@Param("id") id: string): Promise<DeleteOpeningHoursResponseDto> {
    return this.deleteOpeningHours.execute({ id });
  }
}