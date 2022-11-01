import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { Dish } from '../dishs/entities/dish.entity';
import { DishMeal } from '../dish_meal/entities/dish_meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Dish, DishMeal])],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
