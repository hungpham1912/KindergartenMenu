import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DishMealService } from './dish_meal.service';
import { CreateDishMealDto } from './dto/create-dish_meal.dto';
import { UpdateDishMealDto } from './dto/update-dish_meal.dto';

@Controller('dish-meal')
export class DishMealController {
  constructor(private readonly dishMealService: DishMealService) {}

  @Post()
  create(@Body() createDishMealDto: CreateDishMealDto) {
    return this.dishMealService.create(createDishMealDto);
  }

  @Get()
  findAll() {
    return this.dishMealService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishMealService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDishMealDto: UpdateDishMealDto,
  ) {
    return this.dishMealService.update(+id, updateDishMealDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishMealService.remove(+id);
  }
}
