import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MealsService } from './meals.service';

@ApiTags('Meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  async create() {
    return await this.mealsService.create();
  }

  @Get()
  async get() {
    return await this.mealsService.findAll();
  }
}
