import { Injectable } from '@nestjs/common';
import { CreateDishMealDto } from './dto/create-dish_meal.dto';
import { UpdateDishMealDto } from './dto/update-dish_meal.dto';

@Injectable()
export class DishMealService {
  create(createDishMealDto: CreateDishMealDto) {
    return 'This action adds a new dishMeal';
  }

  findAll() {
    return `This action returns all dishMeal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dishMeal`;
  }

  update(id: number, updateDishMealDto: UpdateDishMealDto) {
    return `This action updates a #${id} dishMeal`;
  }

  remove(id: number) {
    return `This action removes a #${id} dishMeal`;
  }
}
