import { Module } from '@nestjs/common';
import { DishMealService } from './dish_meal.service';
import { DishMealController } from './dish_meal.controller';

@Module({
  controllers: [DishMealController],
  providers: [DishMealService]
})
export class DishMealModule {}
