import { Body, Controller, Post } from "@nestjs/common";
import { CreateCinemaUseCase } from "../../application/use-cases/CreateCinema/CreateCinemaUseCase";

@Controller("cinemas")
export class CinemaController {
  constructor(private readonly createCinema: CreateCinemaUseCase) {}

  @Post()
  async create(@Body() body: { name: string; city?: string }) {
    return this.createCinema.execute(body);
  }
}